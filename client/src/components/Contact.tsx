import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState<any | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span> for
            <span className='font-semibold'>{' ' + listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className='w-full border border-gray-300 rounded-lg p-3'
            name='message'
            placeholder='Enter your message here...'
            id='message'
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'>
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
