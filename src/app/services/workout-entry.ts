export interface WorkoutEntry {
    workout_plan: string/*Object ID*/,
    sections: doneMovementPattern[],
    notes: string,
    user_id: string/*Object ID*/,
}

export interface doneMovementPattern {
    workout_section: string/*Object ID*/,
    sets: doneSets[]
}

export interface doneSets {
    exercise: string/*Object ID*/,
    set_index: number,
    reps: number
}