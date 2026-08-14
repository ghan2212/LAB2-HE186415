import React, { useEffect, useState } from 'react'

function useLocalStorage( key,initialValue) {
    const [storeValue,setStoreValue] = useState(()=>{
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
          return  initialValue;
        }
    });
    useEffect(()=>{
        try {
            window.localStorage.setItem(key,JSON.stringify(storeValue))
        } catch (error) {
            console.log(error);
            
        }
    },[key,storeValue])
  return [storeValue,setStoreValue]
}
export default useLocalStorage
