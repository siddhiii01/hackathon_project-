import React, { useEffect, useState } from "react"
import {useForm, type SubmitHandler} from "react-hook-form"
import type {EmergencyFormData} from '../types/emergency'
import axios from "axios"

export const Emergency: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {errors}
  } = useForm<EmergencyFormData>();

  const onSubmit:SubmitHandler<EmergencyFormData> = async(data:EmergencyFormData) => {
    console.log(data);
    const res = await axios.post("http://localhost:3000/emergency",data);
    console.log(res.data);
  }

  //const [loc,setLoc] = useState({});

  function success(position:GeolocationPosition) {
    setValue("location.lat",position.coords.latitude);
    setValue("location.lng",position.coords.longitude);
  } 

  function error() {
    console.error("Location access denied");
  } 

  useEffect(() =>{
    if(!navigator.geolocation) return;
    try {
    navigator.geolocation.getCurrentPosition(success,error);
    } catch(error) {
      console.error("Location access failed");
    }
  },[])

  
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl text-center font-semibold ">Report Emergency</h2>

            <div className="mb-8">
              <h2 className="font-medium mb-3">Emergency Type</  h2>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                <label className="block text-sm/6 font-medium border p-2">
                  <input type="radio" value={"medical"} {...register("type",{required:true})} className="hidden"/>
                Medical</label>
                <label className="block text-sm/6 font-medium border p-2">
                  <input type="radio" value={"fire"} {...register("type",{required:true})} className="hidden"/>
                Fire</label>
                <label className="block text-sm/6 font-medium border p-2">
                  <input type="radio" value={"police"} {...register("type",{required:true})} className="hidden"/>
                Police</label>

              </div>
              {errors.type && <p className="text-red-500">Type is required</p>}
            </div>

            <div className="mb-8">
              <label htmlFor="severity" className="block text-sm/6 font-medium ">Severity</label>
              <div className="mt-2">
                <input type="range" id="severity" min={1} max={10} {...register("severity",{required:true ,valueAsNumber:true})} className="w-100"/>
                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm/6 font-medium">Description</label>
                  <div className="mt-2">
                    <textarea id="description" {...register("description",{required:true})} rows={3} className=" w-full rounded-lg-border border border-gray-300"/>
                  </div>
                  {errors.description && <p className="text-red-500">Description is required</p>}
                </div>
              </div>

              {/* automatic loc */}
              <input type="hidden" {...register("location.lat",{required:true})}/>
              <input type="hidden" {...register("location.lng",{required:true})}/>
              
                <div className="mb-8">
                  <label htmlFor="location" className="block text-sm/6 font-medium">Location</label>     
                  <input
                    type="text"
                    value={`Lat: ${watch("location.lat")}, Lng: ${watch("location.lng")}`}
                    readOnly
                    className="w-full rounded-lg border border-gray-300 p-3 bg-gray-100"
                  />

                </div>
            </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Submit Emergency</button>
          </div>
        </div>

      </form>
    </>
  )
}