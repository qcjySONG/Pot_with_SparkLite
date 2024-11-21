async function translate(text, from, to, options) {
    const { utils } = options;
    const { tauriFetch: fetch } = utils;

    // 星火大模型 API URL 和 Authorization Token
    const URL = "https://spark-api-open.xf-yun.com/v1/chat/completions"; // 星火大模型的 API URL
    const MODEL = "lite"; // 模型类型，根据实际需求调整
    const API_PASSWORD="nLfUQCAeJWwOBcHEfnIm:uhtjZtjISPJZIXCJROPk"

    // 请求体的构建, 输入你自己领域的系统提示词，这样会让翻译更加精准，最好先输入英文的提示词。
    /**
     您是计算机科学、人工智能和计算生物数学领域的专家。
     请将英文文本翻译成中文，确保翻译专业、优雅、流畅，避免典型的机器翻译风格。
     其次，作为专家，您应该能够识别原始文本中的任何格式和排版问题，并将这些问题纠正为更好的格式。
     最后，您需要识别段落中任何明显不相关的部分，并自动省略这些部分，以确保翻译的连贯性和流畅性。
     请仅输出翻译后的文本，不要提供解释。
     */
    const body = {
        model: MODEL,
        messages: [
            { 
                role: "system", 
                content: "You are an expert in computer science, artificial intelligence, and computational bio-mathematics. Please translate the English text into Chinese, ensuring that the translation is professional, elegant, and fluent, avoiding the typical style of machine translation. Secondly, as an expert, you should be able to identify any formatting and typography issues in the original text and correct these to output in a better format. Finally, you need to identify any clearly irrelevant parts within the paragraph and automatically omit these sections to ensure coherence and smoothness in the translation. Please output only the translated text without providing explanations." 
            },
            { role: "user", content: `Translate into Chinese ${text}` }
        ]
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_PASSWORD}`,
    };

    try {
        // 调用 星火大模型 API
        let res = await fetch(URL, {
            method: 'POST',
            headers: headers,
            body: {
                type: 'Json',
                payload: body
            }
        });

        if (res.ok) {
            let result = res.data;
            const { choices } = result;
            if (choices && choices.length > 0) {
                return choices[0].message.content.trim();
            } else {
                throw `Unexpected Response Format: ${JSON.stringify(result)}`;
            }
        } else {
            throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
        }
    } catch (error) {
        throw `Translation Error: ${error}`;
    }
}
