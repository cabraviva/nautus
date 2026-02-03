import chalk from 'chalk';
import { Input, Toggle, Confirm, NumberPrompt, Select, MultiSelect } from 'enquirer';

type ValidatorFunction<T> = (answer: T) => boolean | Promise<boolean>;

export async function prompt(
    question: string,
    defaultValue: string = '',
    validationRegEx: RegExp | null = null,
    canBeEmpty: boolean = false,
    validatorFunction: ValidatorFunction<string> = () => true
): Promise<string> {
    question = `${question}`;
    defaultValue = `${defaultValue}`;
    let validAnswer = false;
    let firstTry = true;
    
    while (!validAnswer) {
        if (!firstTry) console.log(chalk.yellow('Invalid answer!'));
        firstTry = false;
        
        const promptInstance = new Input({
            message: question.trim(),
            initial: defaultValue
        });
        
        const answer = await promptInstance.run().catch(() => {
            console.log(chalk.red('Cancelled'));
            process.exit(1);
        }) as string;
        
        if (answer.trim() === '' && !canBeEmpty) continue;
        if (validationRegEx instanceof RegExp && answer.replace(validationRegEx, '').trim() !== '') continue;
        if (!(await validatorFunction(answer))) continue;
        
        return answer;
    }
    
    throw new Error('Unexpected end of prompt loop');
}

export async function confirm(question: string): Promise<boolean> {
    const promptInstance = new Confirm({
        name: 'question',
        message: question
    });
    
    return await promptInstance.run().catch(() => {
        console.log(chalk.red('Cancelled'));
        process.exit(1);
    }) as boolean;
}

export async function numeral(
    question: string,
    validatorFunction: ValidatorFunction<number> = () => true
): Promise<number> {
    question = `${question}`;
    let validAnswer = false;
    let firstTry = true;
    
    while (!validAnswer) {
        if (!firstTry) console.log(chalk.yellow('Invalid answer!'));
        firstTry = false;
        
        const promptInstance = new NumberPrompt({
            name: 'number',
            message: question.trim()
        });
        
        const answer = await promptInstance.run().catch(() => {
            console.log(chalk.red('Cancelled'));
            process.exit(1);
        }) as number;
        
        if (!(await validatorFunction(answer))) continue;
        
        return answer;
    }
    
    throw new Error('Unexpected end of numeral loop');
}

export async function toggle(question: string, option1: string, option2: string): Promise<string> {
    const promptInstance = new Toggle({
        message: question,
        enabled: option2,
        disabled: option1
    });
    
    const answer = await promptInstance.run().catch(() => {
        console.log(chalk.red('Cancelled'));
        process.exit(1);
    }) as boolean;
    
    return answer ? option2 : option1;
}

export async function select(question: string, choices: string[]): Promise<string> {
    const promptInstance = new Select({
        name: 'select',
        message: question,
        choices: choices
    });
    
    return await promptInstance.run().catch(() => {
        console.log(chalk.red('Cancelled'));
        process.exit(1);
    }) as string;
}

export async function multiSelect(
    question: string,
    choices: string[],
    min: number = 0,
    max: number = Infinity
): Promise<string[]> {
    let validAnswer = false;
    let firstTry = true;
    
    while (!validAnswer) {
        if (!firstTry) console.log(chalk.yellow('Please select at least ' + min + '!'));
        firstTry = false;
        
        const obj: any = {
            name: 'value',
            message: question,
            choices: choices.map(e => ({ name: e, value: e }))
        };
        
        if (max !== Infinity) obj.limit = max;
        
        const promptInstance = new MultiSelect(obj);
        const answer = await promptInstance.run().catch(() => {
            console.log(chalk.red('Cancelled'));
            process.exit(1);
        }) as string[];
        
        if (min !== 0 && answer.length < min) continue;
        
        return answer;
    }
    
    throw new Error('Unexpected end of multiSelect loop');
}
