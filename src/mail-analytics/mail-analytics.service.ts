import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { MailAnalyticsInputDto,AnalyticsInputDto } from './input-dto/input.dto';

@Injectable()
export class MailAnalyticsService {

    /**
     * @description This function is used to detect spam mails, if not spam then categorize them into different categories, namely: Promotions, Social, Primary
     * @param mailData
     * @returns boolean
     * @memberof MailAnalyticsService
     */
    async categorize(mailData: MailAnalyticsInputDto): Promise<string> {
        try {
            const isSpam: boolean = await this.spamCheck(mailData);
            if (!isSpam) {
                let result: any;
                // const apiKey = process.env.API_KEY;
                const apiKey = "9848d93c25e7a3635dc549a625a53a5a5f0bcfaae782ba12c3f5ea923fefd534";
                const url = 'https://api.together.xyz/inference';
                const prompt = `Categorize the following email into primary, promotional or social: ${mailData}\n\nClassification(In just one work only):`

                result = await this.getAnalytics({ url: url, prompt: prompt, apiKey: apiKey });
                if (result == "") throw new HttpException('Error in analyzing the mail category', 500);
                else {
                    switch (result.output.choices[0].text.toLowerCase()) {
                        case 'promotions':
                            return 'Promotions';
                        case 'social':
                            return 'Social';
                        case 'primary':
                            return 'Primary';
                        default:
                            return '';
                    }
                }
            } else if (isSpam) {
                return 'Spam';
            }
            return '';
        } catch (error) {
            console.error('Error in categorizing mails:', error);
        }
    }


    /**
     * @description This function is used to detect spam mails
     * @param mailData
     * @returns boolean
     * @memberof MailAnalyticsService
     */
    async spamCheck(mailData: MailAnalyticsInputDto): Promise<boolean> {
        try {
            let result: any;
            // const apiKey = process.env.API_KEY;
            const apiKey = "9848d93c25e7a3635dc549a625a53a5a5f0bcfaae782ba12c3f5ea923fefd534";
            const url = 'https://api.together.xyz/inference';
            const prompt = `Classify the following email as 'spam' or 'not spam':\n\n${mailData}\n\nClassification(In just one work only):`

            result = await this.getAnalytics({url: url, prompt: prompt, apiKey: apiKey});
            if(result == "") return false;

            return result.output.choices[0].text.toLowerCase() == 'spam' ? true : false;
        } catch (error) {
            console.error('Error in spam detection:', error);
        }
    }


    /**
     * @description This function is used to get the details from the Analytical engine
     * @param inputData
     * @returns object
     * @memberof MailAnalyticsService
     */
    async getAnalytics(inputData: AnalyticsInputDto): Promise<object> {
        try {
            let result: any;
            const options = {
                method: 'POST',
                url: inputData.url,
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: `Bearer ${inputData.apiKey}`
                },
                data: {
                    model: 'togethercomputer/llama-2-7b-chat',
                    prompt: inputData.prompt,
                    max_tokens: 128,
                    stop: '.',
                    temperature: 0.7,
                    top_p: 0.7,
                    top_k: 50,
                    repetition_penalty: 1
                }
            };

            axios
                .request(options)
                .then(function (response) {
                    console.log(response.data);
                    result = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                    result = "";
                });

                console.log(JSON.stringify(result,null,2));

                return result;

        } catch (error) {
            console.error('Error in getting details from the Analytical engine:', error);
        }
}

}
