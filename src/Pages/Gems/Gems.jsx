import { useEffect, useState } from "react";
import GemItem from "../../Components/Gems/GemItem";
import GemDetails from "../../Components/Gems/GemDetails";
import axios from "axios";


export default function Gems() {
    const [selectedGem, setSelectedGem] = useState(null); //nothing selected
    const handleSelectedGem = (gemId) => {
        console.log("Selected gem ID:", gemId);
        setSelectedGem(gemId);
    }
    const [gemsData, setGemsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null)
    
    useEffect(()=>{
      axios.get(process.env.REACT_APP_GetAllGems).then((res)=>{  //api
        setGemsData(res.data);
        setIsLoading(false);
      }).catch((err)=>{
        setError(err.message);
        setIsLoading(false);
      },[])
    })

  if(selectedGem !== null){
    return(
      <>
      <button onClick={()=>setSelectedGem(null)}>Back to Gems List</button>
        <GemDetails gemId={ selectedGem } />
      </>
    )
  }
  return (
    gems.map(
      (gem)=>{
        return <GemItem gemId={gem} onSelect={handleSelectedGem} /> //gem 
      }
    ))
}