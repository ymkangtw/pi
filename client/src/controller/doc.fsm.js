import { createMachine } from "xstate";

export const DOC_STATES = {
  IDLE: "IDLE",
  APPROVAL1: "三級審查",
  APPROVAL2: "二級A審查",
  APPROVAL3: "二級審查",
  APPROVED: "審查完成",
};

export const DOC_EVENTS = {
  SUBMIT: "呈核",
  REJECT: "退回",
  APPROVED: "核准",
};

export const LightMachine = createMachine({
  initial: DOC_STATES.IDLE,
  states: {
    [DOC_STATES.IDLE]: {
      on: {
        [DOC_EVENTS.SUBMIT]: DOC_STATES.APPROVAL1,
        [DOC_EVENTS.REJECT]: DOC_STATES.IDLE,
      },
    },
    [DOC_STATES.APPROVAL1]: {
      on: {
        [DOC_EVENTS.SUBMIT]: DOC_STATES.APPROVAL2,
        [DOC_EVENTS.REJECT]: DOC_STATES.IDLE,
      },
    },
    [DOC_STATES.APPROVAL2]: {
      on: {
        [DOC_EVENTS.SUBMIT]: DOC_STATES.APPROVAL3,
        [DOC_EVENTS.REJECT]: DOC_STATES.IDLE,
      },
    },
    [DOC_STATES.APPROVAL3]: {
      on: {
        [DOC_EVENTS.SUBMIT]: DOC_STATES.APPROVED,
        [DOC_EVENTS.REJECT]: DOC_STATES.IDLE,
      },
    },
    [DOC_STATES.APPROVED]: {},
  },
});
