"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import clsx from "clsx";
import { Check, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Habit = {
    id: number;
    name: string;
    completed: boolean;
};

export default function Home() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [newHabitName, setNewHabitName] = useState("");

    const { getItem, setItem } = useLocalStorage<Habit[]>("habits");

    useEffect(() => {
        const storedHabits = getItem();
        if (Array.isArray(storedHabits)) {
            setHabits(storedHabits);
        }
    }, [getItem]);

    useEffect(() => {
        setItem(habits);
    }, [habits, setItem]);

    const addHabit = () => {
        if (newHabitName.trim() === "")
            return toast.error("Habit name cannot be empty.");
        const newHabit: Habit = {
            id: Date.now(),
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

    const deleteHabit = (id: number) => {
        setHabits(habits.filter((habit) => habit.id !== id));
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addHabit();
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-md md:max-w-2xl p-6 mx-auto">
                <h1 className="text-2xl mb-6 border-b pb-4">
                    Daily Habit Tracker
                </h1>
                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        className="h-12"
                        placeholder="Add a new habit..."
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <Button onClick={addHabit} className="h-12 p-2">
                        Add Habit
                    </Button>
                </div>

                {/* habits display */}
                <div className="mt-6">
                    {habits.length === 0 ? (
                        <p className="text-center">
                            No habits added yet. Start tracking!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {habits.map((habit) => (
                                <Card
                                    key={habit.id}
                                    className={clsx(
                                        habit.completed && "bg-green-400/10"
                                    )}
                                >
                                    <CardContent className="flex items-center justify-between">
                                        <p
                                            className={clsx(
                                                "text-lg",
                                                habit.completed &&
                                                    "line-through text-muted-foreground"
                                            )}
                                        >
                                            {habit.name}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() =>
                                                    toggleHabitComplete(
                                                        habit.id
                                                    )
                                                }
                                                className={clsx(
                                                    habit.completed &&
                                                        "bg-green-400"
                                                )}
                                            >
                                                {habit.completed ? (
                                                    "Completed"
                                                ) : (
                                                    <Check />
                                                )}
                                            </Button>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className="bg-red-400">
                                                        <Trash2 />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Delete Habit
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you
                                                            want to delete this
                                                            habit? This action
                                                            cannot be undone.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="outline">
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            className="bg-red-500/60 hover:bg-red-600"
                                                            onClick={() =>
                                                                deleteHabit(
                                                                    habit.id
                                                                )
                                                            }
                                                        >
                                                            Confirm Delete
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
