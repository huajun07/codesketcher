import { RangeSet, StateEffect, StateField } from '@codemirror/state'
import { EditorView, gutter, GutterMarker } from '@codemirror/view'

// A CodeMirror extension that allows adding breakpoints and keeping track of which lines they are on.
// Reference: https://codemirror.net/examples/gutter/
function createBreakpointsExtension(
  updateBreakpoints: (
    state: EditorView['state'],
    set: RangeSet<GutterMarker>,
  ) => void,
) {
  let state: EditorView['state'] | null = null

  const breakpointMarker = new (class extends GutterMarker {
    override toDOM() {
      return document.createTextNode('🔴')
    }
  })()

  const breakpointEffect = StateEffect.define<{ pos: number; on: boolean }>({
    map: (val, mapping) => ({ pos: mapping.mapPos(val.pos), on: val.on }),
  })

  const breakpointState = StateField.define<RangeSet<GutterMarker>>({
    create() {
      return RangeSet.empty
    },
    update(set, transaction) {
      set = set.map(transaction.changes)
      for (const e of transaction.effects) {
        if (e.is(breakpointEffect)) {
          if (e.value.on)
            set = set.update({ add: [breakpointMarker.range(e.value.pos)] })
          else set = set.update({ filter: (from) => from !== e.value.pos })
        }
      }
      if (state !== null) updateBreakpoints(state, set)
      return set
    },
  })

  const breakpointExtension = [
    breakpointState,
    gutter({
      class: 'cm-breakpoint-gutter',
      markers: (v) => v.state.field(breakpointState),
      initialSpacer: () => breakpointMarker,
      domEventHandlers: {
        mousedown(view, line) {
          toggleBreakpoint(view, line.from)
          return true
        },
      },
      renderEmptyElements: true,
    }),
    EditorView.baseTheme({
      '.cm-breakpoint-gutter .cm-gutterElement': {
        position: 'relative',
        paddingLeft: '4px',
        paddingRight: '4px',
        paddingTop: '2px',
        cursor: 'pointer',
        background: 'inherit',
        fontSize: '0.7em',
      },
      '.cm-breakpoint-gutter .cm-gutterElement:hover': {
        opacity: '40%',
      },
      '.cm-breakpoint-gutter .cm-gutterElement:hover:after': {
        position: 'absolute',
        left: '4px',
        top: '2px',
        content: '"🔴"',
      },
    }),
  ]

  function toggleBreakpoint(view: EditorView, pos: number) {
    state = view.state
    const breakpoints = view.state.field(breakpointState)
    let hasBreakpoint = false
    breakpoints.between(pos, pos, () => {
      hasBreakpoint = true
    })
    view.dispatch({
      effects: breakpointEffect.of({ pos, on: !hasBreakpoint }),
    })
  }

  return breakpointExtension
}

export { createBreakpointsExtension }
