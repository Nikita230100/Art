import { useAppSelector } from '@/shared/hooks';
import { AiApi } from '../../api/AiApi';
import './AiChat.css';
import { useState, type FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';

function AIChat(): React.JSX.Element {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const artsList = useAppSelector((state) => state.art.arts); // Используем правильный селектор

  const buildContextPrompt = (userPrompt: string): string => {
    const artsDescriptions = artsList
      .map((art) => {
        const description = art.description
          ? art.description
          : 'описание отсутствует, но это произведение называется "' + art.name + '"';

        return `Арт "${art.name}" (${art.type}): ${description}`;
      })
      .join('\n');

    return `
      У тебя есть доступ к каталогу произведений искусства. 
      Вот список всех доступных работ с их описаниями:
      
      ${artsDescriptions}
      
      Запрос пользователя: "${userPrompt}"
      
      Проанализируй описания и названия работ и ответь, какие произведения лучше всего соответствуют запросу.
      В ответе укажи:
      - Названия подходящих работ
      - Их описание (если есть)
      - Почему они подходят под запрос
      
      Если ничего не найдено, ответь "К сожалению, ничего не найдено".
    `;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!prompt.trim()) return;
    if (!artsList || artsList.length === 0) {
      setResponse('Каталог артов пока не загружен');
      return;
    }

    setLoading(true);
    setResponse('');

    try {
      const contextPrompt = buildContextPrompt(prompt);
      const serverResponse = await AiApi.generateText(contextPrompt);
      setResponse(serverResponse);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Произошла ошибка при обработке запроса');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat">
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Например: "найди картины с лошадью" или "покажи абстрактные работы"'
          rows={4}
        />

        <button type="submit" disabled={loading || !prompt.trim()}>
          {loading ? 'Ищем...' : 'Найти арты'}
        </button>
      </form>

      {response && (
        <div className="response">
          <h3>Результаты поиска:</h3>
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default AIChat;
