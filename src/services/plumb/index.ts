import { jsPlumb, jsPlumbInstance } from 'jsplumb';
import { OnConnection, SetConnectionT, SetPrevAndNextMatchConnectionsT } from '../../interfaces/plumb.interfaces';
import { toast } from 'react-toastify';
import { EndpointOptions } from 'jsplumb';
import {
	DeleteConnectionsAndEndpointsT,
	DeleteManagedElementT,
	GetInstanceT,
	PlumbDevelopT,
	SetInitialEndpointT,
	SetListenersT,
	UpdateManagedElementOnNextTickT,
	UpdateRelationT,
} from './types';
import { Dispatch, SetStateAction } from 'react';

const PLUMB_CONFIG: EndpointOptions = {
	isSource: true,
	isTarget: true,
	// connector: ['Straight', { stub: 35, gap: -10, cornerRadius: 10 }],
	hoverPaintStyle: { stroke: 'red', strokeWidth: 5 },
	maxConnections: 3,
	endpoint: 'Dot',
};

export const getInstance = ({ container }: GetInstanceT) => {
	const instance = jsPlumb.getInstance({
		PaintStyle: {
			strokeWidth: 2,
			stroke: '#567567',
		},
		Connector: ['Flowchart', { curviness: 20 }],
		Endpoint: ['Dot', { radius: 1 }],
		EndpointStyle: { fill: '#567567' },
		Container: container,
	});
	// TODO: for debuging purposes
	// window.instance = instance;

	instance.repaintEverything();
	return instance;
};

export const deleteConnectionsAndEndpoints = ({ matchIdWithPrefix, instance }: DeleteConnectionsAndEndpointsT) => {
	const connections = instance?.getAllConnections();
	const ednpoints = instance?.getEndpoints(matchIdWithPrefix);

	ednpoints?.forEach((e) => instance?.deleteEndpoint(e));

	const currentConnections = connections?.filter((c) => c.targetId === matchIdWithPrefix || c.sourceId === matchIdWithPrefix);

	currentConnections?.forEach((c) => instance?.deleteConnection(c));

	repaintOnNextTick({ instance });
};

export const addPrefixToMatchId = (matchId: string) => `match__${matchId}`;
export const removePrefixFromMatchId = (matchId: string) => matchId.split('__')[1];

export const updateRelation = ({ matches, targetId, sourceId, type, setMatches }: UpdateRelationT) => {
	const sourceMatch = matches.find((m) => m.id === sourceId);
	const targetMatch = matches.find((m) => m.id === targetId);

	setMatches((prev) => {
		return prev.map((match) => {
			if (targetMatch && sourceMatch && type === 'AddRelation') {
				if (match.id === sourceMatch.id) {
					return {
						...match,
						nextMatchId: targetMatch.id,
					};
				}
				if (match.id === targetMatch.id) {
					return {
						...match,
						prevMatchId: match.prevMatchId ? [...new Set([...match.prevMatchId, sourceMatch.id])] : [...new Set([sourceMatch.id])],
					};
				}
			}
			if (targetMatch && sourceMatch && type === 'RemoveRelation') {
				if (match.id === sourceMatch.id) {
					return {
						...match,
						nextMatchId: null,
					};
				}
				if (match.id === targetMatch.id) {
					return {
						...match,
						prevMatchId: [...new Set(match.prevMatchId?.filter((id) => id !== sourceMatch.id))] || null,
					};
				}
			}
			return match;
		});
	});
};

export const deleteManagedElement = ({ instance, matchIdWithPrefix }: DeleteManagedElementT) => {
	const inst = instance as PlumbDevelopT;
	delete inst.getManagedElements()[matchIdWithPrefix];
};

export const unbindListeners = (instance: jsPlumbInstance) => {
	instance.unbind('connection');
	instance.unbind('click');
	instance.unbind('beforeDrop');
};

export const setListeners = ({ instance, matches, setMatches }: SetListenersT) => {
	unbindListeners(instance);

	instance.bind('connection', (data) => {
		const { targetId, sourceId } = data;

		updateRelation({
			matches,
			setMatches,
			targetId: removePrefixFromMatchId(targetId),
			sourceId: removePrefixFromMatchId(sourceId),
			type: 'AddRelation',
		});

		//* Set labels on connection
		const allConnections = instance.getAllConnections();
		const connections = allConnections.filter((c) => c.targetId === targetId);
		connections.forEach((c) => c.setLabel('X'));
	});

	instance.bind('click', (data) => {
		//* Click on remove label
		const { sourceId, targetId } = data;
		const connections = instance.getAllConnections();
		const currentConnection = connections.find((c) => c.sourceId === sourceId);
		if (currentConnection) {
			updateRelation({
				matches,
				setMatches,
				targetId: removePrefixFromMatchId(targetId),
				sourceId: removePrefixFromMatchId(sourceId),
				type: 'RemoveRelation',
			});
			instance.deleteConnection(currentConnection);
		}
	});

	instance.bind('beforeDrop', (data) => {
		const connectionInfo = data as OnConnection;
		//* Before Connection
		const { sourceId, targetId } = data;
		const sourceUUID = sourceId.split('__')[1];
		const targetUUID = targetId.split('__')[1];
		const sourceMatch = matches.find((m) => m.id === sourceUUID);
		const targetMatch = matches.find((m) => m.id === targetUUID);

		if (sourceMatch?.columnIndex === targetMatch?.columnIndex) {
			toast.warning("You can't connect two matches in the same round");
			return false;
		}

		if (connectionInfo.dropEndpoint.type === 'Dot') {
			toast.warning('You can connect only from left side of match');
			return false;
		}
		return true;
	});
};

const repaintOnNextTick = ({ instance }: Pick<UpdateManagedElementOnNextTickT, 'instance'>) => {
	setTimeout(() => instance.repaintEverything());
};

export const updateManagedElementOnNextTick = ({ matchIdWithPrefix, instance }: UpdateManagedElementOnNextTickT) => {
	const inst = instance as PlumbDevelopT;

	setTimeout(() => {
		const data = inst.getManagedElements()[matchIdWithPrefix];
		if (data) {
			data.el = document.getElementById(matchIdWithPrefix);
			instance.revalidate(matchIdWithPrefix);
		}
	});
};

export const setEndpoint = ({ instance, match, isLastColumn, matchRef, matchIdWithPrefix }: SetInitialEndpointT) => {
	const id = matchRef || matchIdWithPrefix || '';

	if (match.columnIndex > 0 && !isLastColumn) {
		instance.addEndpoint(id, { anchor: 'Left', maxConnections: 2 }, { ...PLUMB_CONFIG, endpoint: 'Blank', isSource: false });
		instance.addEndpoint(id, { anchor: 'Right', maxConnections: 2 }, { ...PLUMB_CONFIG, endpoint: 'Dot', isSource: true }); // Dot
	}

	if (!match.columnIndex && !isLastColumn) {
		instance.addEndpoint(id, { anchor: 'Right', maxConnections: 2 }, { ...PLUMB_CONFIG, endpoint: 'Dot' }); // Dot
	}

	if (match.columnIndex > 0 && isLastColumn) {
		instance.addEndpoint(id, { anchor: 'Left', maxConnections: 2 }, { ...PLUMB_CONFIG, isSource: false, endpoint: 'Blank' });
	}
};

export const setConnection = ({ instance, sourceMatchIdWithoutPrefix, targetMatchIdWithoutPrefix }: SetConnectionT) => {
	instance.connect({
		source: instance.getEndpoints(addPrefixToMatchId(sourceMatchIdWithoutPrefix)).find((el) => el.type === 'Dot'),
		target: instance.getEndpoints(addPrefixToMatchId(targetMatchIdWithoutPrefix)).find((el) => el.type === 'Blank'),
		cssClass: `connector-${sourceMatchIdWithoutPrefix}`,
	});
};

export const setPrevAndNextMatchConnections = ({ instance, matches, draggableMatch }: SetPrevAndNextMatchConnectionsT) => {
	const prevMatchId = matches.find((match) => match.prevMatchId?.includes(draggableMatch?.id!))?.id;
	const nextMatchIdFirst = matches.find((match) => match.nextMatchId === draggableMatch?.id)?.id;
	const nextMatchIdLast = matches.findLast((match) => match.nextMatchId === draggableMatch?.id)?.id;

	if (prevMatchId && draggableMatch) {
		setConnection({
			instance,
			targetMatchIdWithoutPrefix: prevMatchId,
			sourceMatchIdWithoutPrefix: draggableMatch.id,
		});
	}

	if (nextMatchIdFirst && draggableMatch) {
		setConnection({
			instance,
			targetMatchIdWithoutPrefix: draggableMatch.id,
			sourceMatchIdWithoutPrefix: nextMatchIdFirst,
		});
	}
	if (nextMatchIdLast && draggableMatch) {
		setConnection({
			instance,
			targetMatchIdWithoutPrefix: draggableMatch.id,
			sourceMatchIdWithoutPrefix: nextMatchIdLast,
		});
	}
};

export const removeDynamicConnectorStyles = () => {
	// * Remove styels
	[...document.querySelectorAll('.jtk-connector')].forEach((connector) => {
		connector.querySelector('path')?.setAttribute('stroke', 'black');
		connector.querySelector('path')?.setAttribute('stroke-width', '2px');
		(connector as HTMLElement).style.zIndex = 'auto';
		(connector as HTMLElement).style.background = 'transparent';
		connector.removeAttribute('stroke-dasharray');
		connector.querySelector('path')?.setAttribute('stroke-dasharray', '0');
	});
};

export const addDynamicConnectorStyles = (matchesIds: Set<string>, setIntervals: Dispatch<SetStateAction<NodeJS.Timeout[]>>) => {
	[...matchesIds].forEach((id) => {
		const svgLine = document.querySelector(`.connector-${id}`) as HTMLElement;
		if (svgLine) {
			svgLine.querySelector('path')?.setAttribute('stroke', '#1876d2');
			svgLine.querySelector('path')?.setAttribute('stroke-width', '4px');
			svgLine.setAttribute('stroke-dasharray', '5 5');
			setIntervals((prev) => {
				return [
					...prev,
					setInterval(() => {
						svgLine.querySelector('path')?.setAttribute('stroke-dasharray', `${3 + Math.random() * (2 - 1)}`);
						svgLine.style.background = '#fff';
						svgLine.style.zIndex = '1';
					}, 150),
				];
			});
		}
	});
};

export const DEFAULT_ZOOM = 1;
export const STEP_ZOOM = 0.1;

export const changeZoom = (zoom: number, instance: jsPlumbInstance | null) => {
	if (!instance) {
		return;
	}
	const transformOrigin = [0.5, 0.5];
	const el = instance.getContainer() as HTMLElement;
	const s = 'scale(' + zoom + ')';
	const oString = transformOrigin[0] * 100 + '% ' + transformOrigin[1] * 100 + '%';

	el.style['transform'] = s;
	el.style['transformOrigin'] = oString;
	instance.setZoom(zoom);
};
