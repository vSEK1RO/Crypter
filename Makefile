### Change -I -L -l vars for your dependencies locations
DEPSDIR = /home/sek1ro/Desktop/se/libs
DEPS = 
-I = ${patsubst %, -I${DEPSDIR}/%/include, ${DEPS}}
-L = ${patsubst %, -L${DEPSDIR}/%/lib, ${DEPS}}
-l = -lcryptopp
### Read upper

CC = g++
DBG = gdb
CFLAGS = -Wall -Wextra -Werror -O0 -g
OBJS = 

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