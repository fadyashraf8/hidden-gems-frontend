import i18n from "i18next"; //for localization logic
import { initReactI18next, Translation } from "react-i18next"; //integration
import Languagedetector from "i18next-browser-languagedetector";  //automattically sets language based on USER BROWSER SETTINGS

const resources = {
    en: {
        Translation: {
            "welcome": "Welcome to our application",
            "description": "This is a sample description in English.",
            "static_test": "This is a static English word"
        }
    },
    ar: {
        Translation: {
            "welcome": "مرحبًا بك في تطبيقنا",   
            "description": "هذا وصف تجريبي باللغة العربية.",
            "static_test": "هذه كلمة عربية ثابتة"
        }
    }
};

i18n.use(Languagedetector) //gets current language users' browser 
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", //initial lang
        fallbackLng: "en",
        interpolation: {
            escapeValue: false //react already safes from xss
        }
    })

export default i18n;