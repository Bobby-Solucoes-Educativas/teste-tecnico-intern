describe('Sketch', function () {
  describe('common', () => {
    it('should setup a dead grid', () => {
      const grid = setupGrid(4);

      grid.forEach((row) => {
        row.forEach((element) => {
          expect(element).toEqual(0);
        });
      });
    });
  });

  describe('rules', () => {
    it('should return the specified cell on the grid', () => {
      const grid = setupGrid(4);
      grid[2][2] = 1;

      expect(cell(2, 2, grid)).toEqual(1);
    });

    it('a dead cell with exactly 3 living neighbors becomes alive', () => {
      const present = setupGrid(10);
      const future = setupGrid(10);

      present[2][2] = 1;
      present[3][1] = 1;
      present[4][2] = 1;

      computeCell(3, 2, present, future);

      expect(cell(3, 2, future)).toEqual(1);

      present[2][2] = 0;

      computeCell(3, 2, present, future);

      expect(cell(3, 2, future)).toEqual(0);
    });

    it('a living cell with 2 or 3 living neighbors stays alive', () => {
      const present = setupGrid(10);
      const future = setupGrid(10);

      present[2][2] = 1;
      present[2][1] = 1;
      present[3][2] = 1;

      computeCell(2, 2, present, future);

      expect(cell(2, 2, future)).toEqual(1);

      present[3][3] = 1;

      computeCell(2, 2, present, future);

      expect(cell(2, 2, future)).toEqual(1);

      present[3][3] = 0;
      present[2][1] = 0;

      computeCell(2, 2, present, future);

      expect(cell(2, 2, future)).toEqual(0);
    });

    it('a living cell with more than 3 living neighbors dies (as if by overpopulation).', () => {
      const present = setupGrid(10);
      const future = setupGrid(10);

      present[2][2] = 1;
      present[2][1] = 1;
      present[3][2] = 1;
      present[2][3] = 1;
      present[1][2] = 1;

      computeCell(2, 2, present, future);

      expect(cell(2, 2, future)).toEqual(0);

      present[3][2] = 0;

      computeCell(2, 2, present, future);

      expect(cell(2, 2, future)).toEqual(1);
    });
  });
});
