import React from 'react';
import { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

const CreateListing = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [formData, setFormData] = useState({
    imageUrls: [] as string[],
  });
  const [imageUploadError, setImageUploadError] = useState<boolean | string>(false);
  const [uploading, setUploading] = useState(false);

  console.log(formData);

  const storeImage = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImageSubmit = async () => {
    if (files !== null && files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises: Promise<string>[] = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]) as Promise<string>);
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          console.error(error);
          setImageUploadError('There was an error uploading your images. Please try again.');
          setUploading(false);
        });
    } else if (files && files.length === 0) {
      setImageUploadError('Please select at least one image.');
      setUploading(false);
    } else if (files && files.length + formData.imageUrls.length >= 7) {
      setImageUploadError('You can only upload up to 6 images.');
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <main className='p-3  max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength={62}
            minLength={10}
            required
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type='checkbox' id='sale' className='w-5' />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='rent' className='w-5' />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='parking' className='w-5' />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='furnished' className='w-5' />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='offer' className='w-5' />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                className='p-3 border border-gray-300 rounded-lg'
                type='number'
                id='bedrooms'
                min={1}
                max={10}
                required
              />
              <p>Beds</p>
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <input
                  className='p-3 border border-gray-300 rounded-lg'
                  type='number'
                  id='bathrooms'
                  min={1}
                  max={10}
                  required
                />
                <p>Baths</p>
              </div>
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <input
                  className='p-3 border border-gray-300 rounded-lg'
                  type='number'
                  id='regularPrice'
                  min={1}
                  max={10}
                  required
                />
                <div className='flex flex-col items-center'>
                  <p>Regular Price</p>
                  <span className='text-xs'>($ / month)</span>
                </div>
              </div>
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <input
                  className='p-3 border border-gray-300 rounded-lg'
                  type='number'
                  id='discountedPrice'
                  min={1}
                  max={10}
                  required
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted Price</p>
                  <span className='text-xs'>($ / month)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              onClick={handleImageSubmit}
              disabled={uploading}
              type='button'
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url) => (
              <div key={url} className='flex justify-between p-3 border items-center '>
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />

                <button
                  onClick={() => handleRemoveImage(formData.imageUrls.indexOf(url))}
                  type='button'
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>
                  Delete
                </button>
              </div>
            ))}
          <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
