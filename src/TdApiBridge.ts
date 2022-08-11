const fs = require('fs');
const { parse } = require('comment-json');
const prettier = require('prettier');

class TdApiBridge {
    constructor(str: string | undefined) {
        if(str) {
            this.getResInter(str);
        }
    }

    /**
     * 生成res的类型注释
     * @param str 
     */
    getResInter(str: string) {
        const bodyJson = parse(this.jsonStr(str));
        const resBodyInter = this.generateBody(bodyJson);
        const orettierStr = prettier.format(resBodyInter, {
            parser: 'typescript',
            trailingComma: 'all',
            singleQuote: true,
            tabWidth: 4
        });
        fs.writeFileSync('./resut.ts', orettierStr);
    }

    /**
     * 将res body的字符串转为json
     * @param str 
     * @returns 
     */
    jsonStr(str: string) {
        const list = str.split('\n');

        if(!Array.isArray(list)) {
            return '';
        }

        return list.map(item => {
            // 有注释的
            if(item.includes(':') && item.includes('//')){
                const [key, valueWithDesc] = item.split(':') || [];
                const [value, description] = valueWithDesc ? valueWithDesc.split('//') : [];
                // 类型
                const type = this.getType(str);
    
                // 原值
                const val = value ? value.replace(/\"|\'|\,/g, '').trim() : '';
    
                const obj = type + '|||' +  description + '|||' + val;
                return `${key}: "${obj}",`;
            }
            return item;
        }).join('\n');
    
    }

    /**
     * 获取res body字段类型
     * @param str 
     * @returns string
     */
    getType(str: string) {
        const value = str ? str.replace(/\"|\'|\,/g, '').trim() : '';

        const mapType = [
            {
                test: /\'|\"/.test(str),
                type: 'string'
            },
            {
                test: ['false', 'true'].includes(value),
                type: 'boolean'
            },
            {
                test: Number(value),
                type: 'boolean'
            }
        ];

        const index = mapType.findIndex(i => i.test);

        return index >= 0 ? mapType[index].type : 'any';
    }

    /**
     * 生成requestBody的注释
     * @param {*} obj 返回的json
     * @param {*} keyLabel interface的key
     * @param {*} str interface的内容
     * @param {*} result 最终生成的结果
     * @returns 
     */
    generateBody(obj: object, keyLabel = 'Result', str = '', result = '') {
        Object.entries(obj).forEach(([key, value]) => {
            if(Array.isArray(value)){
                str += `${key}?: I${key}[];`;
                result += this.generateBody(value[0], `I${key}`);
                return;
            } 
    
            if(Object.prototype.toString.call(value) === '[object Object]') {
                str += `${key}?: I${key};`;
                result += this.generateBody(value as object, `I${key}`);
                return;
            }
            if(typeof value === 'string' && value.includes('|||')) {
                const [type, description] = value ? value.split('|||') : [];
                str += `
                /** ${description} */
                ${key}?: ${type};
                `;
            }else {
                str += `${key}?: ${typeof value};`;
            }
        });
    
        result += `interface ${keyLabel} {${str}}`;
        return result;
    }
}

module.exports = TdApiBridge;