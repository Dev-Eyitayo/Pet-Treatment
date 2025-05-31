import { Link } from "react-router-dom";

const userPets = [
  {
    id: 1,
    name: "Buddy",
    breed: "Golden Retriever",
    age: 3,
    image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=300&q=80",
  },
  {
    id: 2,
    name: "Whiskers",
    breed: "Siamese Cat",
    age: 2,
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&q=80",
  },
];

export default function PetList() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Your Pets
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userPets.map((pet) => (
          <Link
            to={`/pets/${pet.id}`}
            key={pet.id}
            className="group bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {pet.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {pet.breed} • {pet.age} year{pet.age > 1 && "s"} old
              </p>
              <p className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                View Profile →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
