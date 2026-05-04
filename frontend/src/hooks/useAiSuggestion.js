import { useState } from 'react';
import { improveText } from '../services/api';

export function useAiSuggestion(formData, setFormData, setCharCount) {
  const [aiSuggestions, setAiSuggestions] = useState({});

  const updateAiSuggestion = (fieldName, updates) => {
    setAiSuggestions(prev => ({
      ...prev,
      [fieldName]: {
        ...(prev[fieldName] || { loading: false, suggestion: '', showPreview: false }),
        ...updates,
      },
    }));
  };

  const handleImproveText = async (fieldName) => {
    const originalText = formData[fieldName] || '';
    updateAiSuggestion(fieldName, { loading: true, showPreview: false, suggestion: '' });

    const suggestion = await improveText(originalText);

    updateAiSuggestion(fieldName, { loading: false, suggestion, showPreview: true });
  };

  const handleUseSuggestion = (fieldName) => {
    const suggestionText = aiSuggestions[fieldName]?.suggestion || '';
    if (!suggestionText) return;

    setFormData(prev => ({ ...prev, [fieldName]: suggestionText }));
    setCharCount(prev => ({ ...prev, [fieldName]: suggestionText.length }));
    updateAiSuggestion(fieldName, { showPreview: false });
  };

  const handleCancelSuggestion = (fieldName) => {
    updateAiSuggestion(fieldName, { showPreview: false, suggestion: '' });
  };

  return {
    aiSuggestions,
    updateAiSuggestion,
    handleImproveText,
    handleUseSuggestion,
    handleCancelSuggestion,
  };
}
