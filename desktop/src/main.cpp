#include <QApplication>
#include <QLabel>
#include <QMenu>
#include <QMenuBar>
#include <QMainWindow>
#include <QLineEdit>
#include <QPushButton>
#include <QMessageBox>

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);
    
    // Создание объекта главного окна
    QMainWindow mainWindow;
    mainWindow.setWindowTitle("Пример с кнопкой");
    
    // Создание объекта метки и добавление на главное окно
    QLabel label("Привет, мир!");
    label.setAlignment(Qt::AlignCenter);
    mainWindow.setCentralWidget(&label);
    
    // Создание объекта кнопки и добавление на главное окно
    QPushButton button("Нажми меня", &mainWindow);
    mainWindow.setCentralWidget(&button);
    
    // Создание объекта меню и добавление пунктов меню
    QMenu *fileMenu = new QMenu("Файл");
    fileMenu->addAction("Открыть");
    fileMenu->addAction("Сохранить");
    fileMenu->addAction("Выход");
    
    // Создание панели меню и добавление меню на неё
    QMenuBar *menuBar = mainWindow.menuBar();
    menuBar->addMenu(fileMenu);
    
    // Связываем событие нажатия кнопки с обработчиком
    QObject::connect(&button, &QPushButton::clicked, [&](){
        QMessageBox::information(&mainWindow, "Сообщение", "Кнопка была нажата!");
    });
    
    // Отображение главного окна
    mainWindow.setGeometry(100, 100, 400, 200);
    mainWindow.show();
    
    return app.exec();
}