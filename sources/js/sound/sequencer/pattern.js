import times from 'lodash.times';
import create_note from 'sound/sequencer/note';

export default({length=32}) => {
  let pattern = times(length, ()=> []);
  return {
    get pattern(){
      return pattern;
    },
    set pattern(matrix2d){
      pattern = matrix2d.map(notes =>
        notes.map(create_note));
    },
    push(pos, note){
      pattern[pos].push(note);
    }
  }
}
