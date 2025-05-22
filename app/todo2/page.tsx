import { useState, useEffect } from "react";

interface Habit {
    id: number;
    name: string;
    completed: boolean;
}

const LOCAL_STORAGE_KEY = "habitTrackerHabits";

const HomePage = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [newHabitName, setNewHabitName] = useState("");

    // Load habits from local storage on initial mount
    useEffect(() => {
        try {
            const storedHabits = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedHabits) {
                setHabits(JSON.parse(storedHabits));
            }
        } catch (error) {
            console.error("Failed to load habits from local storage:", error);
            // Optionally clear invalid data or show an error message
        }
    }, []); // Empty dependency array means this runs only once on mount

    // Save habits to local storage whenever the habits state changes
    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(habits));
        } catch (error) {
            console.error("Failed to save habits to local storage:", error);
            // Optionally show an error message to the user
        }
    }, [habits]); // Dependency array ensures this runs whenever 'habits' state changes

    const addHabit = () => {
        if (newHabitName.trim() === "") return;
        const newHabit: Habit = {
            id: Date.now(), // Simple unique ID
            name: newHabitName,
            completed: false,
        };
        setHabits([...habits, newHabit]);
        setNewHabitName("");
    };

    const toggleHabitComplete = (id: number) => {
        setHabits(
            habits.map((habit) =>
                habit.id === id
                    ? { ...habit, completed: !habit.completed }
                    : habit
            )
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addHabit();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Daily Habit Tracker
                </h1>

                <div className="flex mb-6">
                    <input
                        type="text"
                        className="flex-grow border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add a new habit..."
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <button
                        onClick={addHabit}
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Add Habit
                    </button>
                </div>

                <div>
                    {habits.length === 0 ? (
                        <p className="text-center text-gray-500">
                            No habits added yet. Start tracking!
                        </p>
                    ) : (
                        <ul className="space-y-4">
                            {habits.map((habit) => (
                                <li
                                    key={habit.id}
                                    className={`flex items-center justify-between p-4 rounded-md shadow-sm ${
                                        habit.completed
                                            ? "bg-green-100 border-l-4 border-green-500"
                                            : "bg-gray-50 border-l-4 border-gray-300"
                                    }`}
                                >
                                    <span
                                        className={`text-lg ${
                                            habit.completed
                                                ? "line-through text-gray-600"
                                                : "text-gray-800"
                                        }`}
                                    >
                                        {habit.name}
                                    </span>
                                    <button
                                        onClick={() =>
                                            toggleHabitComplete(habit.id)
                                        }
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            habit.completed
                                                ? "bg-green-500 text-white hover:bg-green-600"
                                                : "bg-blue-500 text-white hover:bg-blue-600"
                                        } focus:outline-none focus:ring-2 ${
                                            habit.completed
                                                ? "focus:ring-green-500"
                                                : "focus:ring-blue-500"
                                        } focus:ring-opacity-50`}
                                    >
                                        {habit.completed
                                            ? "Completed"
                                            : "Mark Complete"}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
