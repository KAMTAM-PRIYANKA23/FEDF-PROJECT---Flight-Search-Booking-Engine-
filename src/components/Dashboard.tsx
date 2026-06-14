import React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl font-bold">
            User Dashboard
          </h1>
          <p className="mt-2">
            Welcome to SkyWings Airlines Booking System
          </p>
        </div>

        {/* Module 2 Features */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* New Booking */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-blue-600">
              New Booking
            </h2>
            <p className="mt-2 text-gray-600">
              Start a new flight booking process.
            </p>

            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() =>
                alert(
                  "Flight Search module will be implemented in Version 3."
                )
              }
            >
              Open
            </button>
          </div>

          {/* Booking History */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-green-600">
              Booking History
            </h2>

            <ul className="mt-3 list-disc ml-5 text-gray-600">
              <li>BK101 - Hyderabad to Delhi</li>
              <li>BK102 - Chennai to Mumbai</li>
            </ul>
          </div>

          {/* Cancel Booking */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-red-600">
              Cancel Booking
            </h2>

            <p className="mt-2 text-gray-600">
              Users can cancel their booked flights.
            </p>

            <button
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => alert("Booking cancelled successfully.")}
            >
              Cancel Sample Booking
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-yellow-600">
              Notifications
            </h2>

            <ul className="mt-3 list-disc ml-5 text-gray-600">
              <li>Welcome to SkyWings Airlines.</li>
              <li>Your account was created successfully.</li>
              <li>New booking features coming soon.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}