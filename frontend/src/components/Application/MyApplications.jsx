import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../main'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const MyApplications = () => {

  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");


  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();


  useEffect(() => {
    try {
      if (user && user.role === "Employer") {
        axios
          .get("http://localhost:4000/api/v1/application/employer/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications)
          });
      } else {
        axios
          .get("http://localhost:4000/api/v1/application/jobseeker/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [isAuthorized]);


  if (!isAuthorized) {
    navigateTo("/");
  }


  const deleteApplication = (id) => {
    try {
      axios
        .delete(`http://localhost:400/api/v1/application/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplication) =>
            prevApplication.filter((application) => application._id !== id))
        })
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }


  const openModel = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  }


  const closeModel = () => {
    setModalOpen(false);
  }


  return (
    <section className='"my_application page'>
        {}
    </section>
  )
}

export default MyApplications