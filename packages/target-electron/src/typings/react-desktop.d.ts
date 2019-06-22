declare module 'react-desktop/windows' {
  export class Window extends React.Component<{
    background?: string | boolean // Sets the background color of a component, if boolean, the color will be used as the background color.
    chrome?: boolean // Sets the chrome of the window.
    color?: string // Sets the main color of a component and it's children.
    height?: number | string // Sets the height of a component.
    hidden?: boolean // Sets the visibility of a component.
    horizontalAlignment?: string // Sets the horizontal alignment of the component's content
    Property?: 'left' | 'center' | 'right'
    padding?: string // Sets the padding inside a component. E.G. "30px 20px"
    theme?: 'light' | 'dark' // Sets the UI theme that is used by this component and its children elements.
    verticalAlignment?: 'top' | 'center' | 'bottom' // Sets the vertical alignment of the component's content.
    width?: number | string // Sets the width of a component.
  }> {}

  export class TitleBar extends React.Component<{
    background?: string | boolean // Sets the background color of a component, if boolean, the color will be used as the background color.
    controls?: boolean // Sets the visibility of the controls of the title bar.
    color?: string // Sets the main color of a component and it's children.
    isMaximized?: boolean // Sets the title bar state to maximized.
    onCloseClick?: () => any // Callback function of the close button.
    onMaximizeClick?: () => any // Callback function of the maximize button
    onMinimizeClick?: () => any // Callback function of the minimize button
    onRestoreDownClick?: () => any // Callback function of the restore down button
    title?: string // Sets the title of the title bar.
    theme?: 'light' | 'dark' // Sets the UI theme that is used by this component and its children elements.
  }> {}
}

declare module 'react-desktop/macOs' {
  export class Window extends React.Component<{
    background?: string // Sets the background color of a component.
    chrome?: boolean // Sets the chrome of the window.
    height?: number // Sets the height of a component.
    hidden?: boolean // Sets the visibility of a component.
    horizontalAlignment?: 'left' | 'center' | 'right' // Sets the horizontal alignment of the component's content
    padding?: string | number // Sets the padding inside a component.  E. G. "30px 20px"
    paddingBottom?: string | number // Sets the padding bottom inside a component.
    paddingLeft?: string | number // Sets the padding left inside a component.
    paddingRight?: string | number // Sets the padding right inside a component.
    paddingTop?: string | number // Sets the padding top inside a component.
    verticalAlignment?: 'top' | 'center' | 'bottom' // Sets the vertical alignment of the component's content.
    width?: number // Sets the width of a component.
  }> {}

  export class TitleBar extends React.Component<{
    controls?: boolean // Sets the visibility of the controls of the title bar.
    inset?: boolean // Sets the controls of the title bar state to be inset.
    isFullscreen?: boolean // Sets the title bar state to fullscreen.
    onCloseClick?: () => any // Callback function of the close button.
    onMaximizeClick?: () => any // Callback function of the maximize button
    onMinimizeClick?: () => any // Callback function of the minimize button
    onResizeClick?: () => any // Callback function of the resize button
    title?: string // Sets the title of the title bar.
    transparent?: boolean // Make the title bar background transparent.
  }> {}
}
