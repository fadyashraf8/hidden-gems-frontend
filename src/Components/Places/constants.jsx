import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import TapasTwoToneIcon from '@mui/icons-material/TapasTwoTone';
import StadiumTwoToneIcon from '@mui/icons-material/StadiumTwoTone';
import SpaTwoToneIcon from '@mui/icons-material/SpaTwoTone';
import CoffeeMakerTwoToneIcon from '@mui/icons-material/CoffeeMakerTwoTone';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import { LocateIcon, StarIcon } from 'lucide-react';

export const BASE_URL = "http://localhost:3000"; 

export const THEME = {
  RED: '#DD0303',
  DARK: '#2D2E2F',
  GREY: '#6E7072'
};

export const FEATURED_PATHS = [
  'restaurant',
  'shopping', 
  'active life', 
  'spa & wellness',
  'coffee shops'
];


// export function capitalizeWords(str) {

//     if (!str) return "";
//     else{
//         str[0] = str[0].toUpperCase();
//         return str;
//     }
  
// }



export const FILTERS_CONFIG = [
  { 
    label: "Rating", 
    stateKey: "avgRating",
    options: [
      { label: "4 Stars & Up", value: 4, icon: <StarIcon size={18} color="#faaf00" fill="#faaf00" /> },
      { label: "3 Stars & Up", value: 3, icon: <StarIcon size={18} color="#faaf00" fill="#faaf00" /> },
      { label: "2 Stars & Up", value: 2, icon: <StarIcon size={18} color="#faaf00" fill="#faaf00" /> },
      { label: "Any Rating", value: 0, icon: <StarIcon size={18} color="#ccc" /> }
    ]
  },
  { 
    label: "Category", 
    stateKey: "category",
    options: [ 
      { label: "Shopping", value: "69218697994d0764a7d68af8", icon: <ShoppingCartTwoToneIcon /> },
      { label: "Spa & Wellness", value: "6921f4b30438850db447eea3", icon: <SpaTwoToneIcon /> },
      { label: "Restaurant", value: "6924ef277cfda2cb735faa9d", icon: <TapasTwoToneIcon /> },
      { label: "Active Life", value: "692812e2a5dd77e8a2c286f9", icon: <StadiumTwoToneIcon /> },
      { label: "Coffee Shops", value: "6928132ca5dd77e8a2c28701", icon: <CoffeeMakerTwoToneIcon /> },
      { label: "More", value: "more", icon: <MoreHorizTwoToneIcon /> } 
    ]
  },
  { 
    label: "Location", 
    stateKey: "gemLocation",
    options: [
      { label: "Shubra", value: "shubra", icon: <LocateIcon size={18} /> }, 
      { label: "Zamalek", value: "zamalek", icon: <LocateIcon size={18} /> },
      { label: "Korba", value: "korba", icon: <LocateIcon size={18} /> },
      { label: "Tagmo3", value: "tagmo3", icon: <LocateIcon size={18} /> },
      { label: "October", value: "october", icon: <LocateIcon size={18} /> },
      { label: "Embaba", value: "embaba", icon: <LocateIcon size={18} /> },
      { label: "Abbasia", value: "abbasia", icon: <LocateIcon size={18} /> },
      { label: "Sherouk", value: "sherouk", icon: <LocateIcon size={18} /> },
      { label: "Obbour", value: "obbour", icon: <LocateIcon size={18} /> },
      { label: "Any Location", value: "", icon: <LocateIcon /> }
    ]
  }
];