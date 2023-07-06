FROM --platform=linux/amd64 public.ecr.aws/lambda/python:3.10

COPY executor/main.py ${LAMBDA_TASK_ROOT}

CMD ["main.handler"]