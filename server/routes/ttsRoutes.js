const express = require("express");
const router = express.Router();

const supportedLanguages = ["hi", "en", "es", "fr", "it"];

router.post("/tts", async (req, res) => {
    try {
        const { text, language, voice } = req.body;

        // API Key Validation
        if (!process.env.ELEVENLABS_API_KEY) {
            return res.status(500).json({
                success: false,
                message: "Speech service is not configured."
            });
        }

        // Text Validation
        if (typeof text !== "string" || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid text."
            });
        }

        const cleanText = text.trim();

        if (cleanText.length > 5000) {
            return res.status(400).json({
                success: false,
                message: "Text cannot exceed 5000 characters."
            });
        }

        // Language Validation
        if (!supportedLanguages.includes(language)) {
            return res.status(400).json({
                success: false,
                message: "Unsupported language."
            });
        }

        // Voice Validation
        if (
            typeof voice !== "string" ||
            !/^[a-zA-Z0-9_-]{1,100}$/.test(voice)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid voice selected."
            });
        }

        // Default text
        let translatedText = cleanText;

        // Translation: English to Selected Language
        if (language !== "en") {

            // MyMemory API character/byte limit
            if (Buffer.byteLength(cleanText, "utf8") > 450) {
                return res.status(400).json({
                    success: false,
                    message: "For translation, please enter text under 450 bytes."
                });
            }

            // Prepare Translation Request
            const params = new URLSearchParams({
                q: cleanText,
                langpair: `en|${language}`
            });

            // Call MyMemory Translation API
            const translationResponse = await fetch(
                `https://api.mymemory.translated.net/get?${params.toString()}`
            );

            if (!translationResponse.ok) {
                return res.status(502).json({
                    success: false,
                    message: "Translation service is temporarily unavailable."
                });
            }

            const translationData = await translationResponse.json();

            // Debug Logs
            console.log("Selected Language:", language);
            console.log(
                "MyMemory Full Response:",
                JSON.stringify(translationData, null, 2)
            );

            // Validate Translation Response
            if (
                translationData.responseStatus !== 200 ||
                !translationData.responseData?.translatedText
            ) {
                console.error(
                    "MyMemory Error:",
                    translationData.responseDetails
                );

                return res.status(502).json({
                    success: false,
                    message: "Translation failed. Please try again."
                });
            }

            // Get Translated Text
            translatedText =
                translationData.responseData.translatedText.trim();

            // Remove Hindi-specific unwanted suffix
            if (language === "hi") {
                translatedText = translatedText
                    .replace(/\s*हिंदी\s+अर्थ\s*[।.!?]*\s*$/u, "")
                    .trim();
            }

            // Clean Extra Whitespace
            translatedText = translatedText
                .replace(/\s+/g, " ")
                .trim();

            // Remove Surrounding Quotes
            translatedText = translatedText
                .replace(/^["'“”‘’]+|["'“”‘’]+$/g, "")
                .trim();

            // Empty Translation Check
            if (!translatedText) {
                return res.status(502).json({
                    success: false,
                    message: "Translation returned empty text."
                });
            }

            // Normalize Text for Comparison
            const normalizeText = (value) =>
                value
                    .toLowerCase()
                    .replace(/[.!?,;:'"“”‘’]/g, "")
                    .replace(/\s+/g, " ")
                    .trim();

            // Prevent Untranslated English from Going to TTS
            if (
                language !== "en" &&
                normalizeText(translatedText) === normalizeText(cleanText)
            ) {
                console.error(
                    `Translation failed for language: ${language}`,
                    translationData.responseDetails
                );

                return res.status(502).json({
                    success: false,
                    message: `Translation to ${language} failed. Please try again with different text.`
                });
            }

            // Translation Logs
            console.log("Translated Text:", translatedText);
            console.log("MYMEMORY TRANSLATION:", translatedText);
        }

        // ElevenLabs Text-to-Speech API
        const elevenLabsResponse = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
            {
                method: "POST",

                headers: {
                    "xi-api-key": process.env.ELEVENLABS_API_KEY,
                    "Content-Type": "application/json",
                    "Accept": "audio/mpeg"
                },

                body: JSON.stringify({
                    text: translatedText,
                    model_id: "eleven_multilingual_v2"
                })
            }
        );

        // ElevenLabs Error Handling
        if (!elevenLabsResponse.ok) {
            const errorDetails = await elevenLabsResponse.text();

            console.error(
                "ElevenLabs Status:",
                elevenLabsResponse.status
            );

            console.error(
                "ElevenLabs Error:",
                errorDetails
            );

            return res.status(502).json({
                success: false,
                message: "Speech generation failed. Check your voice or API key."
            });
        }

        // Convert Audio Response to Buffer
        const audioBuffer = await elevenLabsResponse.arrayBuffer();

        // Send MP3 Audio
        res.set({
            "Content-Type": "audio/mpeg",
            "Content-Disposition": "attachment; filename=speech.mp3",
            "X-Content-Type-Options": "nosniff"
        });

        return res.send(Buffer.from(audioBuffer));

    } catch (error) {
        console.error("TTS Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to generate speech. Please try again."
        });
    }
});

module.exports = router;