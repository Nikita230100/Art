import { axiosInstanceBuyer } from '../../../shared/lib/axiosInstanceBuyer';

interface IGenerateTextResponse {
  data: string;
}

export class AiApi {
  static async generateText(prompt: string): Promise<string> {
    const { data } = await axiosInstanceBuyer.post<IGenerateTextResponse>('/ai/generate', {
      prompt,
    });

    return data.data;
  }
}
