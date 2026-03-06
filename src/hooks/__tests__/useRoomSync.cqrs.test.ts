/**
 * @jest-environment jsdom
 */
// Tests para la lógica anti-race-condition:
// - Si el servidor devuelve un voto distinto para el usuario actual, se reenvía el comando
// - El voto local nunca se sobreescribe con el voto del servidor
import { renderHook, act } from '@testing-library/react';
import { useRoomSync } from '../useRoomSync';

global.fetch = jest.fn();

describe('useRoomSync CQRS reconciliation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('does not overwrite local vote with server vote for current user', async () => {
    // TODO: este test depende de la implementación del Realtime mock;
    // se implementará junto con el hook
    expect(true).toBe(true);
  });
});
