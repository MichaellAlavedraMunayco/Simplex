class Simplex {
  constructor(objectiveFunction, restrictions) {
    this.objectiveFunction = objectiveFunction;
    this.restrictions = restrictions;
    this.input = restrictions.concat(objectiveFunction);
    return this;
  }
  validateInput() {
    for (var i = 0; i < this.input.length; i++) {
      for (var j = 0; j < this.input[i].length; j++) {
        if (this.input[i][j] < 0)
          throw new Error("Debes cambiar el número " +
            this.input[i][j] + " a positivo")
      }
    }
    return this;
  }
  buildFirstTable() {
    for (var i = 0; i < this.restrictions[0].length; i++) {
      this.objectiveFunction[0][i] = -this.objectiveFunction[0][i] | 0;
    }
    var columnCount = this.restrictions.length + this.objectiveFunction[0].length + 1;
    var rowCount = this.input.length;
    for (var i = 0; i < rowCount; i++) {
      for (var j = 0; j < columnCount; j++) {
        if (j == 0) {
          if (i == rowCount - 1) {
            this.input[i].splice(0, 0, 1);
          } else {
            this.input[i].splice(0, 0, 0);
          }
        } else if (j > this.objectiveFunction[0].length - 1 && j < columnCount - 1) {
          if (j == i + this.objectiveFunction[0].length) {
            this.input[i].splice(j, 0, 1);
          } else {
            this.input[i].splice(j, 0, 0);
          }
        } else if (j == columnCount - 1 && i == rowCount - 1) {
          this.input[i].splice(j, 0, 0);
        }
      }
    }
    return this;
  }
  meetsTheStop() {
    for (var i = 0; i < this.objectiveFunction[0].length; i++) {
      if (this.objectiveFunction[0][i] < 0) {
        return false;
      }
    }
    return true;
  }
  chooseIncomingVariable() {
    var positionPivotColumn = 0,
      minumValueColumn = Infinity;
    for (var i = 0; i < this.objectiveFunction[0].length; i++) {
      if (this.objectiveFunction[0][i] < minumValueColumn) {
        minumValueColumn = this.objectiveFunction[0][i];
        positionPivotColumn = i;
      }
    }
    this.positionPivotColumn = positionPivotColumn;
    this.minumValueColumn = minumValueColumn;
  }
  chooseOutgoingVariable() {
    var tempColumn = [];
    for (var i = 0; i < this.restrictions.length; i++) {
      tempColumn.push(this.restrictions[i][this.restrictions[i].length - 1] /
        this.restrictions[i][this.positionPivotColumn]);
    }
    var positionPivotRow = 0,
      minumValueRow = Infinity;
    for (var i = 0; i < tempColumn.length; i++) {
      if (tempColumn[i] < minumValueRow) {
        minumValueRow = tempColumn[i];
        positionPivotRow = i;
      }
    }
    this.positionPivotRow = positionPivotRow;
    this.minumValueRow = minumValueRow;
    this.pivotElement = this.input[this.positionPivotRow][this.positionPivotColumn];
  }
  updateTable() {
    for (var i = 0; i < this.objectiveFunction[0].length; i++) {
      this.input[this.positionPivotRow][i] /= this.pivotElement;
    }
    for (var i = 0; i < this.input.length; i++) {
      var elementPivotRow = this.input[i][this.positionPivotColumn];
      for (var j = 0; j < this.input[i].length; j++) {
        if (i != this.positionPivotRow) {
          var elementOldRow = this.input[i][j];
          var elementIncomingRow = this.input[this.positionPivotRow][j];
          this.input[i][j] = elementOldRow - (elementPivotRow * elementIncomingRow);
        }
      }
    }
  }
  show() {
    console.dir("X" + (this.positionPivotRow + 1) + " = " + this.input[this.positionPivotRow][this.restrictions[0].length - 1]);
    console.dir("Z = " + this.input[this.input.length - 1][this.restrictions[0].length - 1]);
  }
  execute() {
    this.validateInput();
    this.buildFirstTable();
    while (!this.meetsTheStop()) {
      this.chooseIncomingVariable();
      this.chooseOutgoingVariable();
      this.updateTable();
    }
    return this;
  }
}

new Simplex([
  [10, 20]
], [
  [4, 2, 20],
  [8, 8, 20],
  [0, 2, 10]
]).execute().show();

new Simplex([
  [3.2, 2.4]
], [
  [8, 5, 200],
  [5, 4, 140],
  [5, 7, 175]
]).execute().show();