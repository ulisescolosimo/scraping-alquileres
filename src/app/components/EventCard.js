// src/app/components/EventCard.js
export default function EventCard({ event }) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <img className="w-full" src={event.image} alt={event.title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{event.title}</div>
        <p className="text-gray-700 text-base">{event.description}</p>
      </div>
      <div className="px-6 py-4">
        <span className="text-xl font-bold">{`$${event.price}`}</span>
        <button className="bg-blue-500 text-white px-4 py-2 rounded ml-4 hover:bg-blue-600 transition-colors">
          Comprar Ticket
        </button>
      </div>
    </div>
  );
}
