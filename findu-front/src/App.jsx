
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './routes/Home'
import Header from './utils/Header'
import Footer from './utils/Footer'
import AdminPanel from './routes/AdminPanel'
import AdminEvent from './routes/Events/AdminEvent'
import AddEvent from './routes/Events/AddEvent'
import EditEvent from './routes/Events/EditEvent'
import EventDetail from './routes/Events/EventDetail'
import EventsByCat from './utils/EventsByCat'
import AdminCat from './routes/Cat/AdminCat'
import AddCat from './routes/Cat/AddCat'
import AdminFeatures from './routes/Features/AdminFeatures'
import AddFeature from './routes/Features/AddFeature'
import EditFeature from './routes/Features/EditFeature'
import RegisterForm from './routes/Auth/RegisterForm'
import LoginForm from './routes/Auth/LoginForm'
import MyProfile from './routes/MyProfile'
import Users from './routes/Users/Users.jsx'
import Favs from './routes/Users/Favs.jsx'
import EventReservationDetail from './routes/Events/EventReservationDetail.jsx'
import Booking from './routes/Users/Booking.jsx'



function App() {

  return (
    <>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adminPanel" element={<AdminPanel />} />
          <Route path="/adminEvent" element={<AdminEvent />} />
          <Route path="/addEvent" element={<AddEvent />} />
          <Route path="/editEvent/:id" element={<EditEvent />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/eventsByCat/:id" element={<EventsByCat />} />
          <Route path="/adminCat" element={<AdminCat />} />
          <Route path="/addCat" element={<AddCat />} />
          <Route path="/adminFeatures" element={<AdminFeatures />} />
          <Route path="/addFeature" element={<AddFeature />} />
          <Route path="/editFeature/:id" element={<EditFeature />} />
          <Route path="/registrarse" element={<RegisterForm />} />
          <Route path="/iniciarSesion" element={<LoginForm />} />
          <Route path="/miPerfil" element={<MyProfile />} />
          <Route path="/users" element={<Users />} />
          <Route path="/favs" element={<Favs />} />
          <Route path="/EventReservationDetail/:id" element={<EventReservationDetail/>} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App
