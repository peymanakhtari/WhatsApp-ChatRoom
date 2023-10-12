module.exports = {
    content: [
        './Views/**/*.{html,js,cshtml}',
        './wwwroot/**/*.{html,js,cshtml}',
    ],
    theme: {
        extend: {
            colors: {
                clifford: '#da373d',
            }
        },
        screens: {
            // '3xs': '360px',
            // '2xs': '390px',
            'xs': '480px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
            '3xl': '1800px',
        }
    },
    plugins: [],
}