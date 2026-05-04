const improveText = async (text) => {
  const API_KEY = import.meta.env.VITE_AI_API_KEY;

  if (!API_KEY) {
    return text + ' (mejorado)';
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Eres un inspector automotriz profesional. Mejora los textos de observaciones técnicas haciéndolos claros, formales y precisos. No inventes información, solo mejora la redacción. Usa un tono profesional y conciso.',
          },
          {
            role: 'user',
            content: `Mejora este texto para un informe técnico automotriz:\n\n${text}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || text;
  } catch (error) {
    console.error('Error IA:', error);
    return text;
  }
};

export { improveText };
