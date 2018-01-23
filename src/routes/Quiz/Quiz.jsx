// EXTERNAL DEPENDENCIES
import React, {Component} from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { List } from 'immutable'
import axios from 'axios'

// INTERNAL DEPENDENCIES
import { quizQns, quizSubmit } from 'actions'
import { Flex, Wrapper, Typography, Space, Form } from 'components'
import { Header, Question, Validate } from 'local'

const { H5 } = Typography

const restApi = 'https://murmuring-taiga-86309.herokuapp.com'

class Quiz extends Component {
  componentDidMount() {
    axios.get(`${restApi}/quizz`)
      .then(res => {
        this.props.dispatch(quizQns({
          questions: res.data
        }))
      });
  }
  handleSubmit(username, event) {
    event.preventDefault();
    var answers= {};
    for (const [key, value] of new FormData(event.target).entries())
    {
        answers[key] = value;
    }
    axios.post(`${restApi}/quiz/submit`, {
        answers,
        username
      })
    .then(res => {
      this.props.dispatch(quizSubmit({
        quizStatus: res.data.status,
        quizStatusMsg: res.data.msg,
        quizScore: res.data.score
      }))
    });
  }
  render () {
    const { dispatch } = this.props
    const questions = this.props.state.getIn(['questions'], List())
    const quizScore = this.props.state.getIn(['quizScore'], '')
    const quizStatus = this.props.state.getIn(['quizStatus'], '')
    const quizStatusMsg = this.props.state.getIn(['quizStatusMsg'], '')
    const username = this.props.state.getIn(['username'], '')
    //const username = 'username'
    return (
      <Wrapper>
          <Header username={username} />
          <Space height={'20px'} />
          <Form method="post"
            onSubmit={this.handleSubmit.bind(this, username)}
            autoComplete="off"
          >
            {
              (quizStatus == 'success') ? (
              <H5>You have successfully completed the Quiz with {quizScore} / {questions.length} </H5>
              ): (
                questions.map(
                  (question, i) => <Question qNo={i} key={i} question={question} />
                )  
              )
            }
            {
              (quizStatus == 'success') ? null : (
                <Validate error={quizStatusMsg} />
                )
            }
          </Form>
      </Wrapper>
    )
  }
}

// s function
const s = state => ({ state })

// d function
const d = dispatch => ({ dispatch })

export default withRouter(connect(s, d)(Quiz))
