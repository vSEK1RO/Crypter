### Change -I -L -l vars for your dependencies locations
INCS = /usr/include
LIBS = /urs/lib
DEPS = qt6 qt6/QtWidgets
-I = ${patsubst %, -I${INCS}/%, ${DEPS}} -I${INCS}
-L = ${patsubst %, -L${LIBS}/%, ${DEPS}} -L${LIBS}
-l = -lcryptopp -lQt6Widgets -lQt6Core
### Read upper

CC = g++
DBG = gdb
CFLAGS = -Wall -Wextra -Werror -O0 -g -fPIC
OBJS = mainwindow.o

SRCDIR = src
OBJDIR = obj
BINDIR = bin
DIRS = ${OBJDIR} ${BINDIR}

TARGET = ${SRCDIR}/main.cpp

build: ${DIRS} ${BINDIR}/app.exe

${DIRS}:
	mkdir $@

${BINDIR}/app.exe: ${patsubst %.o, ${OBJDIR}/%.o, ${OBJS}} ${TARGET}
	${CC} -o $@ $^ ${-I} ${-L} ${-l} ${CFLAGS}

run: build
	./${BINDIR}/app.exe

${DBG}: ${BINDIR}/app.exe
	gdb $^

${OBJDIR}/%.o: ${SRCDIR}/%.cpp ${SRCDIR}/%.hpp
	${CC} -o $@ -c $< ${-I} ${CFLAGS}

clean:
	rm obj/*.o
	rm */*.exe