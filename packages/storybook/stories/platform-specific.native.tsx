import { UiContext } from '@ag/core/context'
import { NbUi } from '@ag/ui-nativebase'
import { storiesOf } from '@storybook/react-native'
import {
  Body,
  Button,
  Container,
  Content,
  Footer,
  FooterTab,
  Header,
  Left,
  Right,
  Root,
  Text,
  Title,
} from 'native-base'
import React from 'react'
import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
  'Async Storage has been extracted from react-native core and will be removed in a future release',
  'Remote debugger is in a background tab',
  'Require cycle:',
])

const ui: UiContext = {
  ...NbUi,

  LoadingOverlay: () => null,

  Dialog: ({ title, children, primary, secondary }) => (
    <Root>
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>{title}</Title>
          </Body>
          <Right />
        </Header>
        <Content>{children}</Content>
        <Footer>
          <FooterTab>
            {primary && (
              <Button
                full
                onPress={primary.onClick}
                disabled={primary.disabled}
                danger={primary.isDanger}
              >
                <Text>{primary.title}</Text>
              </Button>
            )}
            {secondary && (
              <Button
                full
                onPress={secondary.onClick}
                disabled={secondary.disabled}
                danger={secondary.isDanger}
              >
                <Text>{secondary.title}</Text>
              </Button>
            )}
          </FooterTab>
        </Footer>
      </Container>
    </Root>
  ),
}

export { ui, storiesOf }
