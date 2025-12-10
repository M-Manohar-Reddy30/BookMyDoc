import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import AdminMapPreview from "../../components/AdminMapPreview";

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')

  // 🧭 Full Address Object
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    country: ''
  });

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const { backendUrl } = useContext(AppContext)
  const { aToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) return toast.error('Image Not Selected');

      const formData = new FormData();
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify(address))
      formData.append('latitude', latitude)
      formData.append('longitude', longitude)

      // Debug log
      console.log("Submitting Doctor Data:");
      formData.forEach((value, key) => console.log(`${key}:`, value));

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName('');
        setEmail('');
        setPassword('');
        setExperience('1 Year');
        setFees('');
        setAbout('');
        setDegree('');
        setAddress({ line1: '', line2: '', city: '', state: '', country: '' });
        setLatitude('');
        setLongitude('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Add doctor error:", error);
    }
  };

  return (
    <div className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <form
        onSubmit={onSubmitHandler}
        className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll"
      >
        {/* Image Upload */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p>Upload doctor <br /> picture</p>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* Left Side */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div>
              <p>Your name</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>

            <div>
              <p>Doctor Email</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>

            <div>
              <p>Set Password</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>

            <div>
              <p>Experience</p>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="border rounded px-2 py-2 w-full"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={`${i + 1} Year`}>
                    {i + 1} Year
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p>Fees</p>
              <input
                type="number"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder="Doctor fees"
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div>
              <p>Speciality</p>
              <select
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                className="border rounded px-2 py-2 w-full"
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div>
              <p>Degree</p>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="Degree"
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>

            {/* 🏠 Address Fields */}
            <div>
              <p>Address</p>
              <input
                type="text"
                placeholder="Line 1 (e.g. Apollo Hospital)"
                value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                className="border rounded px-3 py-2 w-full mb-2"
                required
              />
              <input
                type="text"
                placeholder="Line 2 (e.g. Jubilee Hills)"
                value={address.line2}
                onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                className="border rounded px-3 py-2 w-full mb-2"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="border rounded px-3 py-2 w-full mb-2"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="border rounded px-3 py-2 w-full mb-2"
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div>
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Write about doctor"
            className="w-full px-4 pt-2 border rounded"
            rows={5}
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Add Doctor
        </button>
      </form>

      {/* 🗺️ Live Map Preview */}
      <div className="mt-6 max-w-4xl">
        <AdminMapPreview
          address={address}
          onCoordsChange={(coords) => {
            setLatitude(coords[0]);
            setLongitude(coords[1]);
          }}
        />
      </div>
    </div>
  )
}

export default AddDoctor
