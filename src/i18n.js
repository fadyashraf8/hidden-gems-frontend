import i18n from "i18next"; //for localization logic
import { initReactI18next } from "react-i18next"; //integration of translation with react components
import Languagedetector from "i18next-browser-languagedetector";  //automattically sets language based on USER BROWSER SETTINGS
import Backend from "i18next-http-backend"
// const resources = {
//     en: {
//         translation: {
//             "welcome": "Welcome to our application",
//             "description": "This is a sample description in English.",
//             "static_test": "This is a static English word"
//         }
//     },
//     ar: {
//         translation: {
//             "welcome": "مرحبًا بك في تطبيقنا",   
//             "description": "هذا وصف تجريبي باللغة العربية.",
//             "static_test": "هذه كلمة عربية ثابتة"
//         }
//     }
// };

i18n.use(Backend)
    .use(Languagedetector) //gets current language users' browser 
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        supportedLngs: ['en', 'ar'], // Essential for filtering detected languages
        //List all 'translation' namespaces 
        ns: ['categories', 'common', 'home'],
        
        // use if none is specified in useTranslation()
        defaultNS: 'common',
        interpolation: {
            escapeValue: false //react already safes from xss
        },
    
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'navigator'],
            // Caches where the language is saved after detection/changeLanguage()
            caches: ['localStorage', 'cookie']
        },
        backend: {
            // Change .json to .js to match your file name
            loadPath: '/locales/{{lng}}/{{ns}}.json', 
        },
        // debug: true // <--- IMPORTANT: for troubleshooting
    })

export default i18n;