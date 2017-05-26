export const Pattern = (events=[]) => {

  const state = {
    events: [...events]
  }

  return {
    getEvents(tick = null){
      if(null === tick){
        return state.events;
      }
      return state.events.filter((event) => event.time === tick);
    },
    push(event){
      state.events.push[event];
    },
    setEvents(events){
      state.events = [...events]
      return this
    }
  }
}
