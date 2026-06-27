import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite"; 
import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";

export default defineConfig({
    plugins: [
        tailwindcss(),
        handlebars({
            partialDirectory: resolve(__dirname, 'src/partials'),

            helpers: {
                splitToArray: (str) => str ? str.split(',') : [],
                staggerText: (text) => {
                    if (typeof text !== 'string') return '';
                    return text.split('').map((char, index) => {
                        if (char === ' ') return '<span>&nbsp;</span>';
                        const delay = index * 10;
                        return `<span class="relative inline-block overflow-hidden"><span class="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full after:content-[attr(data-letter)] after:absolute after:top-full after:left-0" data-letter="${char}" style="transition-delay: ${delay}ms;">${char}</span></span>`;
                    }).join('');
                }
            }
        }),
    ],
});
