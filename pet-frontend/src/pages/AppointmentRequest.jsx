import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

const mockAppointments = [
  {
    id: "1",
    petName: "Buddy",
    petImage:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=100&q=80",
    patientName: "Alex Johnson",
    time: "Today, 10 AM",
    reason: "General Checkup",
    notes:
      "Buddy has been feeling a bit lethargic lately. Owner mentioned loss of appetite.",
    status: "pending",
  },
  {
    id: "2",
    petName: "Whiskers",
    petImage:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=100&q=80",
    patientName: "Maria Garcia",
    time: "Today, 1 PM",
    reason: "Follow-up Visit",
    notes:
      "Follow-up after dental cleaning. Owner wants to check on gum healing.",
    status: "accepted",
  },
];

function StatusBadge({ status }) {
  const statusMap = {
    accepted: {
      text: "Accepted",
      bg: "bg-green-100 text-green-800",
      Icon: CheckCircleIcon,
    },
    pending: {
      text: "Pending",
      bg: "bg-yellow-100 text-yellow-800",
      Icon: ClockIcon,
    },
    declined: {
      text: "Declined",
      bg: "bg-red-100 text-red-800",
      Icon: XCircleIcon,
    },
    rescheduled: {
      text: "Rescheduled",
      bg: "bg-indigo-100 text-indigo-800",
      Icon: PencilSquareIcon,
    },
  };

  const { text, bg, Icon } = statusMap[status] || statusMap.pending;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${bg} select-none`}
    >
      <Icon className='w-4 h-4' />
      {text}
    </span>
  );
}

export default function AppointmentRequest() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const found = mockAppointments.find((appt) => appt.id === id);
    setAppointment(found || null);
  }, [id]);

  if (!appointment) {
    return (
      <div className='max-w-4xl mx-auto px-6 py-12'>
        <p className='text-center text-gray-500 text-lg'>
          Appointment not found.
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-6 py-12'>
      <Link
        to='/'
        className='inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium mb-8'
      >
        <ArrowLeftIcon className='w-5 h-5' />
        Back to Dashboard
      </Link>

      <div className='bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-8 space-y-8'>
        {/* Header: Pet & Owner */}
        <div className='flex flex-col sm:flex-row items-center gap-6 sm:gap-12'>
          <img
            src={appointment.petImage}
            alt={appointment.petName}
            className='w-28 h-28 rounded-full object-cover shadow-md border-4 border-primary-500'
          />
          <div>
            <h1 className='text-3xl font-extrabold text-text-light dark:text-text-dark'>
              {appointment.petName}
            </h1>
            <p className='mt-1 text-gray-600 dark:text-gray-400 font-medium'>
              Owner: {appointment.patientName}
            </p>
          </div>
          <div className='ml-auto'>
            <StatusBadge status={appointment.status} />
          </div>
        </div>

        {/* Appointment Info */}
        <section className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <div>
            <h2 className='text-lg font-semibold text-text-light dark:text-text-dark mb-1'>
              Scheduled Time
            </h2>
            <p className='text-gray-700 dark:text-gray-300'>
              {appointment.time}
            </p>
          </div>
          <div>
            <h2 className='text-lg font-semibold text-text-light dark:text-text-dark mb-1'>
              Reason for Visit
            </h2>
            <p className='text-gray-700 dark:text-gray-300'>
              {appointment.reason}
            </p>
          </div>
        </section>

        {/* Owner Notes */}
        <section>
          <h2 className='text-lg font-semibold text-text-light dark:text-text-dark mb-3'>
            Owner's Notes
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line'>
            {appointment.notes}
          </p>
        </section>

        {/* Actions */}
        <section className='flex flex-col sm:flex-row gap-4 mt-6 border-t border-gray-200 dark:border-slate-700 pt-6'>
          <button
            type='button'
            className='flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition'
          >
            <CheckCircleIcon className='w-5 h-5' />
            Accept
          </button>
          {/* <button
            type='button'
            className='flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition'
          >
            <ClockIcon className='w-5 h-5' />
            Reschedule
          </button> */}
          <button
            type='button'
            className='flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition'
          >
            <XCircleIcon className='w-5 h-5' />
            Decline
          </button>
        </section>
      </div>
    </div>
  );
}
