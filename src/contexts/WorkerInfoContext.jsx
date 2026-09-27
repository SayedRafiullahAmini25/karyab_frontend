import { createContext, useContext, useState } from "react";


const WorkerContext = createContext()

export function WorkerProvider ({children}) {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [password, setPassword] = useState("")
  const [image, setImage] = useState(null);
  const [choosenSkills, setChoosenSkills] = useState([]);
  const [job, setJob] = useState('')
  const [experience, setExperience] = useState('')
  const [about, setAbout] = useState('')
  const [images, setImages] = useState([]);

    const values = {
        userName, setUserName, phoneNumber, setPhoneNumber, email, setEmail, province, setProvince, district, setDistrict,
        password, setPassword, image, setImage, choosenSkills, setChoosenSkills, job, setJob, experience, setExperience,
        about, setAbout, images, setImages
    }

    return (
        <WorkerContext.Provider value={values}>
            {children}
        </WorkerContext.Provider>
    )
}

export function useWorker () {
    return useContext(WorkerContext)
}