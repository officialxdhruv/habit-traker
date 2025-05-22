"use client";
import { Check, Plus, Trash } from "lucide-react";
import React, { useState, useEffect } from "react";

// Habit interface for type safety
interface Habit {
    id: string;
    name: string;
    completed: boolean[];
    createdAt: number;
}

export default function HabitTrackerDashboard() {
    // State for habits and new habit input
    const [habits, setHabits] = useState<Habit[]>([]);
    const [newHabitName, setNewHabitName] = useState<string>("");

    // Load habits from localStorage on initial render
    useEffect(() => {
        const savedHabits = localStorage.getItem("habits");
        if (savedHabits) {
            try {
                const parsedHabits = JSON.parse(savedHabits);
                // Validate and clean up old or corrupted data
                const validHabits = parsedHabits.filter(
                    (habit: Habit) =>
                        habit.id && habit.name && Array.isArray(habit.completed)
                );
                setHabits(validHabits);
            } catch (error) {
                console.error("Error parsing habits from localStorage", error);
            }
        }
    }, []);

    // Save habits to localStorage whenever habits change
    useEffect(() => {
        localStorage.setItem("habits", JSON.stringify(habits));
    }, [habits]);

    // Add a new habit
    const addHabit = () => {
        if (newHabitName.trim()) {
            const newHabit: Habit = {
                id: Date.now().toString(),
                name: newHabitName.trim(),
                completed: Array(7).fill(false), // Track 7 days
                createdAt: Date.now(),
            };
            setHabits((prevHabits) => [...prevHabits, newHabit]);
            setNewHabitName("");
        }
    };

    // Toggle habit completion for a specific day
    const toggleHabitCompletion = (habitId: string, dayIndex: number) => {
        setHabits(
            habits.map((habit) =>
                habit.id === habitId
                    ? {
                          ...habit,
                          completed: habit.completed.map((completed, index) =>
                              index === dayIndex ? !completed : completed
                          ),
                      }
                    : habit
            )
        );
    };

    // Remove a habit
    const removeHabit = (habitId: string) => {
        setHabits(habits.filter((habit) => habit.id !== habitId));
    };

    // Calculate habit completion percentage
    const calculateHabitProgress = (completed: boolean[]) => {
        const completedDays = completed.filter(Boolean).length;
        return Math.round((completedDays / completed.length) * 100);
    };

    // Reset all habits for the week
    const resetAllHabits = () => {
        setHabits(
            habits.map((habit) => ({
                ...habit,
                completed: Array(7).fill(false),
            }))
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Habit Tracker
                </h1>

                {/* Habit Input Section */}
                <div className="flex mb-6">
                    <input
                        type="text"
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addHabit()}
                        placeholder="Enter a new habit"
                        className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={addHabit}
                        className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 transition-colors"
                    >
                        <Plus />
                    </button>
                </div>

                {/* Reset and Stats Section */}
                {habits.length > 0 && (
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-gray-600">
                            Total Habits: {habits.length}
                        </div>
                        <button
                            onClick={resetAllHabits}
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors text-sm"
                        >
                            Reset Week
                        </button>
                    </div>
                )}

                {/* Habits List */}
                <div className="space-y-4">
                    {habits.map((habit) => (
                        <div
                            key={habit.id}
                            className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
                        >
                            <div className="flex-grow">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-lg font-semibold text-gray-700">
                                        {habit.name}
                                    </h2>
                                    <span className="text-sm text-gray-500">
                                        {calculateHabitProgress(
                                            habit.completed
                                        )}
                                        % Complete
                                    </span>
                                </div>

                                {/* Daily Completion Tracker */}
                                <div className="flex space-x-2">
                                    {habit.completed.map((completed, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                toggleHabitCompletion(
                                                    habit.id,
                                                    index
                                                )
                                            }
                                            className={`w-8 h-8 rounded-full flex items-center justify-center 
                        ${
                            completed
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-500"
                        }`}
                                        >
                                            {completed && <Check />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Remove Habit Button */}
                            <button
                                onClick={() => removeHabit(habit.id)}
                                className="ml-4 text-red-500 hover:text-red-700"
                            >
                                <Trash />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {habits.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        <p>No habits yet. Add a new habit to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
