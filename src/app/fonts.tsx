import localFont from 'next/font/local';

export const boldPoppins = localFont({
    src: [{ 
        path: '../fonts/poppins/Poppins-Bold.ttf', 
        style: 'normal', 
    }]
});

export const mediumPoppins = localFont({
    src: [{ 
        path: '../fonts/poppins/Poppins-Medium.ttf', 
        style: 'normal', 
    }]
});

export const poppins = localFont({ 
    src: [{ 
        path: '../fonts/poppins/Poppins-Regular.ttf', 
        style: 'normal',
    }]
});