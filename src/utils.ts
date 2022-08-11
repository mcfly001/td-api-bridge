import { parse } from 'comment-json';
import * as prettier from 'prettier';

/** 将字符串首字母大写 */
export const upperCaseFirst = (str: string) => {
	const [first, ...rest] = str.split('');
	return first.toUpperCase() + rest.join('');
};

/**
 * 格式化interface
 * @param str interface的内容
 * @returns 
 */
export const formatInter = (str: string) => {
    return prettier.format(str, {
        parser: 'typescript',
        trailingComma: 'all',
        singleQuote: true,
        tabWidth: 4
    });
};

/**
 * 将类json格式的str转换为json
 * @param str 
 * @returns 
 */
export const parseStr = (str: string) => {
    return parse(str, undefined, false);
};

/**
 * 将json转换为interface
 * @param json  json格式的内容
 * @param keyLabel interface的名字
 * @param interStr interface的内容
 * @param result 最终输出的interface
 */
export const generateInter = (json = {}, keyLabel: string, interStr = '', result = '') => {
    Object.entries(json).forEach(([key, value]) => {
        if(Array.isArray(value)){
            interStr += `${key}?: I${key}[];`;
            result += generateInter(value[0], `I${key}`);
            return;
        } 

        if(Object.prototype.toString.call(value) === '[object Object]') {
            interStr += `${key}?: I${key};`;
            result += generateInter(value as object, `I${key}`);
            return;
        }

        interStr += `${key}?: ${typeof value};`;
    });


    result += `interface ${keyLabel} {${interStr}}`;
    return result;
};