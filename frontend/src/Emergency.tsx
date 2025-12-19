import React, { useEffect } from "react"
import {useForm, type SubmitHandler} from "react-hook-form"
import type {EmergencyFormData} from '../types/emergency'
import axios from "axios"
import MapView from "./components/MapView"
import { useNavigate } from "react-router-dom"

export const Emergency: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {errors}
  } = useForm<EmergencyFormData>();

  const navigate = useNavigate();
  const { reset } = useForm<EmergencyFormData>();

  const onSubmit:SubmitHandler<EmergencyFormData> = async(data:EmergencyFormData) => {
    const res = await axios.post("http://localhost:3000/emergency",data);

    // user need to see the status whether they r available or not
    const id = res.data.emergencyId;
    reset(); // to refresh input ele after submit
    navigate(`/emergency/${id}`);
  }

  const [loc,setLoc] = React.useState(false);

  function success(position:GeolocationPosition) {
    setValue("location.lat",position.coords.latitude);
    setValue("location.lng",position.coords.longitude);
    setLoc(true);
  } 

  function error() {
    setLoc(false);
    // alert("Location access is required");
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
        <div className="py-14 bg-slate-50 flex items-center justify-center">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl text-center font-semibold ">Report Emergency</h2>

            <div className="mb-4">
              <h2 className="font-medium mt-3 mb-2">Emergency Type</  h2>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                <label className="border rounded-xl p-4 cursor-pointer hover:border-blue-500 text-center">
                  <input type="radio" value={"medical"} {...register("type",{required:true})} className="peer hidden"/>
                Medical</label>
                <label className="border rounded-xl p-4 cursor-pointer hover:border-blue-500 text-center">
                  <input type="radio" value={"fire"} {...register("type",{required:true})} className="hidden"/>
                Fire</label>
                <label className="border rounded-xl p-4 cursor-pointer hover:border-blue-500 text-center">
                  <input type="radio" value={"police"} {...register("type",{required:true})} className="hidden"/>
                Police</label>

              </div>
              {errors.type &&  <p className="text-sm text-red-600 mt-2">
                Please select an emergency type
              </p>}
            </div>

            <div className="mb-4">
              
                <div className="mb-4">
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
              
                <div className="mb-4">
                  <label htmlFor="location" className="block text-sm/6 font-medium">Location</label>     
                  {/* <input
                    type="text"
                    value={`Lat: ${watch("location.lat")}, Lng: ${watch("location.lng")}`}
                    readOnly
                    className="w-full rounded-lg border border-gray-300 p-3 bg-gray-100"
                  /> */}
                  
                </div>
            
              {!loc && <p className="text-red-500 font-bold">Location access is required</p>}
              {loc && (
                 <div style={{ height: "250px" }}>
                  <MapView  lat={watch("location.lat")} lng={watch("location.lng")}/>
                </div>
              )}

          <button type="submit" disabled={!loc} className="bg-blue-500 hover:bg-blue-700 mt-2 text-white font-bold py-2 px-4 border border-blue-700 rounded">Submit Emergency</button>
          </div>
        </div>

      </form>
    </>
  )
}