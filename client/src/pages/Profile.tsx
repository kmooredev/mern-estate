import React, { ChangeEvent } from 'react';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserStart,
  signoutUserFailure,
  signoutUserSuccess,
} from '../redux/user/userSlice';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

interface FormData {
  avatar?: string;
}

const Profile = () => {
  const { currentUser, isLoading, error } = useAppSelector((state) => state.user);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState<any[]>([]); // TODO: change to Listing[] type
  const dispatch = useAppDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser?._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (error) {}
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser?._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file: File) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({
            ...formData,
            avatar: downloadURL,
          })
        );
      }
    );
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser?._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => {
            if (fileRef.current !== null) fileRef.current.click();
          }}
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          src={formData.avatar || currentUser?.avatar}
          alt='profile photo'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>Error Image Upload (image must be less than 2Mb)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded</span>
          ) : (
            ''
          )}
        </p>
        <input
          type='text'
          placeholder='username'
          defaultValue={currentUser?.username}
          className='border p-3 rounded-lg-2'
          id='username'
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='email'
          defaultValue={currentUser?.email}
          className='border p-3 rounded-lg-2'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg-2'
          id='password'
          onChange={handleChange}
        />
        <button
          disabled={isLoading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {isLoading ? 'Loading...' : 'Update'}
        </button>
        <Link
          to={'/create-listing'}
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5 '>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer '>
          Delete Account
        </span>
        <span onClick={handleSignout} className='text-red-700 cursor-pointer '>
          Sign Out
        </span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'Successfully updated user!' : ''}</p>
      <button className='text-green-700 w-full' onClick={handleShowListings}>
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>{showListingsError ? 'Error showing listings' : ''}</p>
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'>
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing photo cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className='text-slate-700 font-semibold flex-1 hover:underline truncate'>
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col items-center'>
                <button className='text-red-700 uppercase'>Delete</button>
                <button className='text-green-700 uppercase'>Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
