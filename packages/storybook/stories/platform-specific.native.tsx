import { UiContext } from '@ag/core'
import { ui as nbUi } from '@ag/ui-nativebase'
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

const ui: UiContext = {
  ...nbUi,

  LoadingOverlay: () => null,

  Dialog: ({ title, children }) => (
    <Root>
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>{title}</Title>
          </Body>
          <Right />
        </Header>
        {children}
      </Container>
    </Root>
  ),
  DialogBody: ({ children }) => <Content>{children}</Content>,
  DialogFooter: ({ primary, secondary }) => (
    <Footer>
      <FooterTab>
        {primary && (
          <Button
            full
            onPress={e => primary.onClick(e as any)}
            disabled={primary.disabled}
            danger={primary.isDanger}
          >
            <Text>{primary.title}</Text>
          </Button>
        )}
        {secondary && (
          <Button
            full
            onPress={e => secondary.onClick(e as any)}
            disabled={secondary.disabled}
            danger={secondary.isDanger}
          >
            <Text>{secondary.title}</Text>
          </Button>
        )}
      </FooterTab>
    </Footer>
  ),
}

export { ui, storiesOf }
