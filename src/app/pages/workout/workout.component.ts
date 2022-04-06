import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemPostService } from 'services/item-post.service';
import { ItemRetrievalService } from 'services/item-retrieval.service';
import { WorkoutEntry, doneMovementPattern, doneSets } from 'services/workout-entry';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.sass']
})
export class WorkoutComponent implements OnInit {

  /*        CONST        */
  INITIAL_STATUS = 3;
  WORKOUT_STATUS = 0;
  MOVEMENT_PATTERN_STATUS = 1;
  EXERCISE_STATUS = 2;
  CONFIRM_STATUS = 5;

  /*        VARIABLES        */
    //Top Level
  level: string = "workout";
  status: number = this.INITIAL_STATUS;
  title_class: string = "unactive";

    //Item Listings
  itemList: any[] = [];
  current_item: string = '';
  current_exercise: any;
  workout: any;
    workout_id: string = '';
    movement_pattern_id: string = '';
    //Exercise
      rep_count: number = 0;
      MIN_REPS: number = 50;/* Not sure what to do with this*/
      form: FormGroup = this.fb.group({
        reps: ["", Validators.required]
      })
    //Record Keeping
    setCount: number;
    setList: doneSets[] = [];
    workoutEntryObj: WorkoutEntry = {
      workout_plan: '',
      sections: [],
      notes: '',
      user_id: ''
    }
    
  constructor(
    private retrieval: ItemRetrievalService,
    private post: ItemPostService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    /**
     * When stuff is RECORDed and Locked In should save something locally
     * 
     * 1. 'Choose A Workout'
     * 2a. Click on 'Workout' to bring up options 
     * 2b. Load in all Workouts (w/ sections field filles with names)
     * 3.  Click on a workout
     * 
     * 4a. Show all sections names within workout
     * 4b. Click on confirmation button
     *        Workout is locked in
     * _______________________________________
     * 5.  Load in Entire Workout (All Movement Patterns w/ All variations)
     * 6a. 'Choose Your Movement Pattern'  
     * 6b.  Show all Movement Patterns
     * 
     * 7a. Click on a Movement Pattern
     * 7b. Show all Variations in Movement Pattern (variation.key: variation.value.name)
     * 
     * 8.  Click on Exercise (Variation)
     *        Movement Pattern is locked in
     * ________________________________________
     * 9.   Show details of exercise | Variation Key (Level), Name, Total Rep Max, Current Total Reps|
     * 
     * 10a. Allow entry of reps in set 
     * RECORD Number of Reps and Set Number 
     * 10b. Add number of Reps to Current Total Reps 
     * 10b. Allow user to change exercise within Movement Pattern
     * REPEAT from 10a until Current Total Reps >= Total Rep Min
     * 10c. Show a movement pattern done button 
     * REPEAT from 10a until Done Button Clicked
     * 
     * RECORD MOVEMENT PATTERN = [Exercise ID, Set Index, Rep Count] (Sets)
     * REMOVE current movement pattern from list of movement patterns
     * 
     * REPEAT from 6a until all Movement Patterns done
     * RECORD  WORKOUT = [Movement Pattern ID, MOVEMENT PATTERN (Sets)] (Sections)
     * 
     * 11a. Show User WORKOUT
     * 11b. Get confirmation
     * RECORD ENTRY = {Workout ID, WORKOUT, Notes, User ID}
     * SEND ENTRY to Express
     * 
     * REFRESH
     */

    //1.Load in all workouts
    this.retrieval.getAllWorkout('name').subscribe(
      val=> {
        this.itemList = val 
        console.log(val)
      }
    )
  }

  /*        Top Level        */
  onTitleClick() {
    console.log("Clicked")

    if (this.status!==this.INITIAL_STATUS) return;
    this.title_class = "active"
    this.status = this.WORKOUT_STATUS
  }

  /*        Item Listings        */
  onWorkoutClick(item: string) {
    //Toggle Choosen Workout
    this.current_item = (this.current_item == item) ? '' : item
  }
  onMovementPatternClick(item: string) {
    this.current_item = item;
    console.log(this.current_item)
    /* With the current implementation when go to exercise
    Checks on the right one via curretnt_item
    so when clicked again makes current item nothing 
    removing all options. This is an ERROR  */
  }
  onExerciseClick(item: any) {
    //Movement Pattern Locked In
    this._lockInMovementPattern();
    var current_exercise = Object.assign({}, item, item?.value);
    delete current_exercise.value
    this.current_exercise = current_exercise;
    console.log(current_exercise)
  }


  /*            Choosing Workout            */
  onWorkoutSelection() {
    //this.current_item = ID
    this.workout_id = this.current_item;
    this._lockInWorkout();
  }
  _lockInWorkout() {
    //Load entire Workout
    this.retrieval.getWorkout(this.current_item, ' ').subscribe(
      val=> {
        this.workout = val 
        console.log(val)

        this.workoutEntryObj.workout_plan = this.current_item;
        this.current_item = '';
        this.itemList = val?.sections;
        this.status = this.MOVEMENT_PATTERN_STATUS;
      }
    )
  }
  _lockInMovementPattern() {
    //because doneMovementPattern is an array best to do a push all in one
    this.setCount = 0;
    this.status = this.EXERCISE_STATUS
  }

  /*            Choosing Movement Pattern            */

  /*            Choosing Exercise            */
  addSet(event: any) {
    var reps = parseInt(event.target?.reps.value)

    if (!this.current_exercise) return false
    if (!reps) return false
    if (reps < 1 || (this.rep_count + reps) > 1000) return false
    
    this.rep_count += reps;
    this.setCount += 1;

    this.setList.push({
      exercise: this.current_exercise._id,
      set_index: this.setCount,
      reps: reps
    })
    return true
  }
  completeMovementPattern() {
    /* RECORD Movement Pattern */
    let doneMV: doneMovementPattern = {
      workout_section: this.current_item,
      sets: this.setList
    }
    this.workoutEntryObj.sections.push(doneMV)
    this.setList = [];

    /* Unlock Movement Pattern */
    this.rep_count = 0;
    this.status = this.MOVEMENT_PATTERN_STATUS

    /* Remove from List of Movement Patterns on Wokrout Object */
    console.log(this.current_item)
    console.log(this.itemList)
    var result = this.itemList.filter(item => item._id != this.current_item)
    this.itemList = result

    /* Check to see if done all Movement Pattrens */
    if (this.itemList.length < 1) this.status = this.CONFIRM_STATUS;
  }
  completeWorkout() {
    /* CONFIRM_STATUS */
    this.post.addEntry(this.workoutEntryObj).subscribe(console.log)
    this.status = this.INITIAL_STATUS
    console.log(this.workoutEntryObj);
  }
}
