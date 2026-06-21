import { Dispatch, MiddlewareAPI, PayloadAction, UnknownAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';
import { Client, over } from 'stompjs';

import api from '../../../common/api';
import { redefineQuestions, redefineStatus, setSocketStatus } from './interviewSlice';

const headers = {
  login: '',
  passcode: '',
};

interface ConnectToWebSocketAction {
  type: 'interview/connectToWebSocket';
  payload: { interviewId: number };
}

interface DisconnectFromWebSocketAction {
  type: 'interview/disconnectFromWebSocket';
}

type KnownAction = ConnectToWebSocketAction | DisconnectFromWebSocketAction | UnknownAction;

const socketMiddleware = () => {
  let stompClient:Client | null = null;

  return (storeAPI: MiddlewareAPI<Dispatch<KnownAction>>) =>
    (next:Dispatch<KnownAction>) =>
      (action:KnownAction):KnownAction|void => {
        const typedAction = action as PayloadAction<{ interviewId:number }>;

        if (action.type === 'interview/connectToWebSocket') {
          const socket = new SockJS(`${api.baseURL.slice(0, -5)}/socket`);
          stompClient = over(socket);

          stompClient.connect(headers, () => {
            storeAPI.dispatch(setSocketStatus('connected'));

            stompClient?.subscribe(`/interview/${typedAction.payload.interviewId}/questions`, (message) => {

              if (!message.body) return;

              const receivedMessage = JSON.parse(message.body);

              if (!receivedMessage.status) {
                storeAPI.dispatch(redefineQuestions(receivedMessage || []));
              } else {
                storeAPI.dispatch(redefineStatus(receivedMessage.status));
              }
            });
          }, (error) => {
            storeAPI.dispatch(setSocketStatus('disconnected'));
            toast.error(error.toString());
          });

          return;
        }

        if (action.type === 'interview/disconnectFromWebSocket') {
          if (stompClient) {
            stompClient.disconnect(() => {
              storeAPI.dispatch(setSocketStatus('disconnected'));
            });
          }

          return;
        }

        next(action);
      };
};

export default socketMiddleware;
